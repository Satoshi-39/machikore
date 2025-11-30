/**
 * マップ編集ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Featureの組み合わせのみ
 */

import React from 'react';
import { View } from 'react-native';
import { EditMapForm } from '@/features/edit-map';
import { SingleDataBoundary, PageHeader } from '@/shared/ui';
import { useEditMapForm } from '../model';

export function EditMapPage() {
  const { map, isLoading, isUpdating, handleSubmit } = useEditMapForm();

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title="マップを編集" />
      <SingleDataBoundary
        isLoading={isLoading}
        error={null}
        data={map}
        notFoundMessage="マップが見つかりません"
        notFoundIcon="map-outline"
      >
        {(mapData) => (
          <EditMapForm
            map={mapData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        )}
      </SingleDataBoundary>
    </View>
  );
}
