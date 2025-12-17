/**
 * マップ編集ページ
 *
 * FSD: pages/edit-map/ui に配置
 * - ルーティング可能な画面
 * - Featureの組み合わせのみ（ロジックは持たない）
 */

import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { EditMapForm, useEditMapForm } from '@/features/edit-map';
import { SingleDataBoundary, PageHeader } from '@/shared/ui';

export function EditMapPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { map, initialTags, isLoading, isUpdating, handleSubmit } = useEditMapForm({
    mapId: id ?? '',
  });

  // map と initialTags の両方が揃っているかチェック
  // isLoading が false の場合のみ、データが確定している
  const formData = !isLoading && map ? { map, initialTags } : null;

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader title="マップを編集" />
      <SingleDataBoundary
        isLoading={isLoading}
        error={null}
        data={formData}
        notFoundMessage="マップが見つかりません"
        notFoundIcon="map-outline"
      >
        {(data) => (
          <EditMapForm
            map={data.map}
            initialTags={data.initialTags}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        )}
      </SingleDataBoundary>
    </View>
  );
}
