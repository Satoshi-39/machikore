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

export function EditSpotPage() {
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
  } = useEditSpotForm();

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader title="スポットを編集" />
      <SingleDataBoundary
        isLoading={isLoading}
        error={null}
        data={spot}
        notFoundMessage="スポットが見つかりません"
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
          />
        )}
      </SingleDataBoundary>
    </View>
  );
}
