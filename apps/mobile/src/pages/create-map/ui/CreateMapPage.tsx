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
import { useI18n } from '@/shared/lib/i18n';

export function CreateMapPage() {
  const { t } = useI18n();
  const { handleSubmit, isLoading } = useCreateMapForm();

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('map.createMap')} />
      <CreateMapForm onSubmit={handleSubmit} isLoading={isLoading} />
    </View>
  );
}
