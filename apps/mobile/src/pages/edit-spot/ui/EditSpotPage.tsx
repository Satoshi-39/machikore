/**
 * スポット編集ページ
 *
 * FSD: pages/edit-spot/ui に配置
 * - ルーティング可能な画面
 * - Featureの組み合わせのみ（ロジックは持たない）
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { EditSpotForm, useEditSpotForm } from '@/features/edit-spot';
import { useSpotDelete } from '@/features/spot-actions';
import { SingleDataBoundary, PageHeader, ArticleFab, ModalPopupMenu, type ModalPopupMenuItem } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export function EditSpotPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const {
    spot,
    existingImages,
    initialTags,
    isLoading,
    isUpdating,
    uploadProgress,
    handleSubmit,
    userMaps,
    isMapsLoading,
    selectedMapId,
    publicSpotsCount,
  } = useEditSpotForm();

  const { handleDelete } = useSpotDelete({
    onSuccess: () => router.back(),
  });

  // 三点メニューのアイテム
  const menuItems = useMemo<ModalPopupMenuItem[]>(() => {
    if (!spot) return [];
    return [
      {
        id: 'delete',
        label: t('spot.deleteSpot'),
        icon: 'trash-outline',
        destructive: true,
        onPress: () => handleDelete(spot.id, {
          isPublic: spot.is_public ?? false,
          publicSpotsCount,
        }),
      },
    ];
  }, [spot, t, handleDelete, publicSpotsCount]);

  // useRefで最新の値を保持（コールバック内で最新値を参照するため）
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  hasUnsavedChangesRef.current = hasUnsavedChanges;

  const handleHasChangesChange = useCallback((hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
  }, []);

  const handleBack = useCallback(() => {
    if (hasUnsavedChangesRef.current) {
      Alert.alert(
        t('spot.unsavedChanges'),
        t('spot.discardChangesMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('spot.discardChanges'),
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  }, [t, router]);

  return (
    <View className="flex-1 bg-surface">
      <PageHeader
        title={t('spot.editSpot')}
        onBack={handleBack}
        rightComponent={
          spot ? (
            <ModalPopupMenu
              items={menuItems}
            />
          ) : undefined
        }
      />
      <SingleDataBoundary
        isLoading={isLoading}
        error={null}
        data={spot}
        notFoundMessage={t('spot.spotNotFound')}
        notFoundIcon="location-outline"
      >
        {(spotData) => (
          <View className="flex-1">
            <EditSpotForm
              spot={spotData}
              existingImages={existingImages}
              initialTags={initialTags}
              onSubmit={handleSubmit}
              isLoading={isUpdating}
              uploadProgress={uploadProgress}
              userMaps={userMaps}
              isMapsLoading={isMapsLoading}
              selectedMapId={selectedMapId}
              publicSpotsCount={publicSpotsCount}
              onHasChangesChange={handleHasChangesChange}
            />
            <ArticleFab
              onPress={() => router.push(`/edit-spot-article/${spotData.id}`)}
              hasContent={!!spotData.article_content}
              disabled={hasUnsavedChanges}
            />
          </View>
        )}
      </SingleDataBoundary>
    </View>
  );
}
