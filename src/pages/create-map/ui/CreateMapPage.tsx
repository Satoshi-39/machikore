/**
 * マップ作成ページ
 *
 * FSD: pages/create-map/ui に配置
 * - ルーティング可能な画面
 * - Featureの組み合わせのみ（ロジックは持たない）
 */

import React from 'react';
import { View } from 'react-native';
import { CreateMapForm, useCreateMapForm } from '@/features/create-map';
import { PageHeader } from '@/shared/ui';

export function CreateMapPage() {
  const { handleSubmit, isLoading } = useCreateMapForm();

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader title="マップ作成" />
      <CreateMapForm onSubmit={handleSubmit} isLoading={isLoading} />
    </View>
  );
}
