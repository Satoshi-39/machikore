/**
 * マップ編集ページ
 *
 * FSD: pages/edit-map/ui に配置
 * - ルーティング可能な画面
 * - Featureの組み合わせのみ（ロジックは持たない）
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EditMapForm, useEditMapForm } from '@/features/edit-map';
import { useMapDelete } from '@/features/map-actions';
import { useI18n } from '@/shared/lib/i18n';
import { SingleDataBoundary, PageHeader, ModalPopupMenu, type ModalPopupMenuItem } from '@/shared/ui';

export function EditMapPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useI18n();
  const router = useRouter();
  const { map, initialTags, isLoading, isUpdating, publicSpotsCount, handleSubmit } = useEditMapForm({
    mapId: id ?? '',
  });

  const { handleDelete } = useMapDelete({
    onSuccess: () => router.back(),
  });

  // 三点メニューのアイテム
  const menuItems = useMemo<ModalPopupMenuItem[]>(() => {
    if (!map) return [];
    return [
      {
        id: 'delete',
        label: t('map.deleteMap'),
        icon: 'trash-outline',
        destructive: true,
        onPress: () => handleDelete(map.id),
      },
    ];
  }, [map, t, handleDelete]);

  // map と initialTags の両方が揃っているかチェック
  // isLoading が false の場合のみ、データが確定している
  const formData = !isLoading && map ? { map, initialTags, publicSpotsCount } : null;

  return (
    <View className="flex-1 bg-surface">
      <PageHeader
        title={t('editMap.title')}
        rightComponent={
          map ? (
            <ModalPopupMenu
              items={menuItems}
            />
          ) : undefined
        }
      />
      <SingleDataBoundary
        isLoading={isLoading}
        error={null}
        data={formData}
        notFoundMessage={t('editMap.notFound')}
        notFoundIcon="map-outline"
      >
        {(data) => (
          <EditMapForm
            map={data.map}
            initialTags={data.initialTags}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            publicSpotsCount={data.publicSpotsCount}
          />
        )}
      </SingleDataBoundary>
    </View>
  );
}
