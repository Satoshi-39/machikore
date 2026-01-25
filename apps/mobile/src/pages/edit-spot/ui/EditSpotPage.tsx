/**
 * スポット編集ページ
 *
 * FSD: pages/edit-spot/ui に配置
 * - ルーティング可能な画面
 * - Featureの組み合わせのみ（ロジックは持たない）
 */

import React from 'react';
import { View } from 'react-native';
import { EditSpotForm, useEditSpotForm } from '@/features/edit-spot';
import { SingleDataBoundary, PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export function EditSpotPage() {
  const { t } = useI18n();
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

  return (
    <View className="flex-1 bg-surface-variant">
      <PageHeader title={t('spot.editSpot')} />
      <SingleDataBoundary
        isLoading={isLoading}
        error={null}
        data={spot}
        notFoundMessage={t('spot.spotNotFound')}
        notFoundIcon="location-outline"
      >
        {(spotData) => (
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
          />
        )}
      </SingleDataBoundary>
    </View>
  );
}
