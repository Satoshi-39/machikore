/**
 * スポット作成ページ
 *
 * FSD: pages/create-spot/ui に配置
 * - ルーティング可能な画面
 * - Featureの組み合わせのみ（ロジックは持たない）
 *
 * Note: プッシュ通知許可モーダルはルートレイアウト(_layout.tsx)で
 * グローバルに管理しているため、このページには含めない
 */

import React, { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CreateSpotForm, useSpotForm } from '@/features/create-spot';
import { useSelectedPlaceStore } from '@/features/search-places';
import { PageHeader, ArticleFab } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useSafeBack } from '@/shared/lib/navigation';
import { isEmptyArticle } from '@/shared/lib';

export function CreateSpotPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { goBack } = useSafeBack();
  const {
    placeData,
    handleSubmit,
    isLoading,
    uploadProgress,
    userMaps,
    isMapsLoading,
    selectedMapId,
  } = useSpotForm();

  // ドラフトデータの確認用
  const draftImages = useSelectedPlaceStore((state) => state.draftImages);
  const draftDescription = useSelectedPlaceStore((state) => state.draftDescription);
  const draftArticleContent = useSelectedPlaceStore((state) => state.draftArticleContent);
  const clearAllDraftData = useSelectedPlaceStore((state) => state.clearAllDraftData);

  // 下書きがあるかどうか
  const hasDraft = draftImages.length > 0 || draftDescription.trim() !== '' || draftArticleContent !== null;

  // 戻るボタン押下時の処理
  const handleBack = useCallback(() => {
    if (hasDraft) {
      Alert.alert(
        t('spot.discardDraftTitle'),
        t('spot.discardDraftMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('spot.discardDraft'),
            style: 'destructive',
            onPress: async () => {
              await clearAllDraftData();
              goBack();
            },
          },
        ]
      );
    } else {
      goBack();
    }
  }, [hasDraft, clearAllDraftData, goBack, t]);

  // データが存在しない場合はnull（エラーハンドリングはhook内で実施済み）
  if (!placeData) return null;

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('spot.registerSpot')} onBack={handleBack} />
      <View className="flex-1">
        <CreateSpotForm
          placeData={placeData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          uploadProgress={uploadProgress}
          userMaps={userMaps}
          isMapsLoading={isMapsLoading}
          selectedMapId={selectedMapId}
        />
        <ArticleFab
          onPress={() => router.push('/create-spot-article')}
          hasContent={!isEmptyArticle(draftArticleContent)}
        />
      </View>
    </View>
  );
}
