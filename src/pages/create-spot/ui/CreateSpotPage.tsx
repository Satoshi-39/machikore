/**
 * スポット作成ページ
 *
 * FSD: pages/create-spot/ui に配置
 * - ルーティング可能な画面
 * - Featureの組み合わせのみ（ロジックは持たない）
 */

import React from 'react';
import { View } from 'react-native';
import { CreateSpotForm, useSpotForm } from '@/features/create-spot';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export function CreateSpotPage() {
  const { t } = useI18n();
  const {
    placeData,
    handleSubmit,
    isLoading,
    uploadProgress,
    userMaps,
    isMapsLoading,
    selectedMapId,
  } = useSpotForm();

  // データが存在しない場合はnull（エラーハンドリングはhook内で実施済み）
  if (!placeData) return null;

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader title={t('spot.registerSpot')} />
      <CreateSpotForm
        placeData={placeData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        uploadProgress={uploadProgress}
        userMaps={userMaps}
        isMapsLoading={isMapsLoading}
        selectedMapId={selectedMapId}
      />
    </View>
  );
}
