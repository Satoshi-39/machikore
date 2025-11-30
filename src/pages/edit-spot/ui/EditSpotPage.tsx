/**
 * スポット編集ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Featureの組み合わせのみ
 */

import React from 'react';
import { View } from 'react-native';
import { EditSpotForm } from '@/features/edit-spot';
import { SingleDataBoundary } from '@/shared/ui';
import { useEditSpotForm } from '../model';

export function EditSpotPage() {
  const { spot, existingImages, isLoading, isUpdating, handleSubmit } = useEditSpotForm();

  return (
    <View className="flex-1 bg-gray-50">
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
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        )}
      </SingleDataBoundary>
    </View>
  );
}
