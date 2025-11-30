/**
 * スポット作成ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Featureの組み合わせのみ
 */

import React from 'react';
import { View } from 'react-native';
import { CreateSpotForm } from '@/features/create-spot';
import { PageHeader } from '@/shared/ui';
import { useSpotForm } from '../model';

export function CreateSpotPage() {
  const { placeData, handleSubmit, isLoading, uploadProgress } = useSpotForm();

  // データが存在しない場合はnull（エラーハンドリングはhook内で実施済み）
  if (!placeData) return null;

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title="スポット登録" />
      <CreateSpotForm
        placeData={placeData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        uploadProgress={uploadProgress}
      />
    </View>
  );
}
