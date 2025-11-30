/**
 * マップ作成ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Featureの組み合わせのみ
 */

import React from 'react';
import { View } from 'react-native';
import { CreateMapForm } from '@/features/create-map';
import { PageHeader } from '@/shared/ui';
import { useMapForm } from '../model';

export function CreateMapPage() {
  const { handleSubmit, isLoading } = useMapForm();

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title="マップ作成" />
      <CreateMapForm onSubmit={handleSubmit} isLoading={isLoading} />
    </View>
  );
}
