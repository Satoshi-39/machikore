/**
 * まえがき編集ページ
 *
 * マップ記事のまえがきをリッチエディタで編集する
 */

import { useCurrentUserId } from '@/entities/user';
import { useMap, useUpdateMap } from '@/entities/map';
import { ArticleEditor } from '@/features/edit-article';
import { useI18n } from '@/shared/lib/i18n';
import { PageHeader } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import type { ProseMirrorDoc } from '@/shared/types';

interface EditArticleIntroPageProps {
  mapId: string;
}

export function EditArticleIntroPage({ mapId }: EditArticleIntroPageProps) {
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: map, isLoading } = useMap(mapId);
  const { mutate: updateMap, isPending: isSaving } = useUpdateMap();

  // 保存処理
  const handleSave = useCallback(
    async (content: ProseMirrorDoc | null): Promise<boolean> => {
      if (!map) return false;

      return new Promise((resolve) => {
        updateMap(
          {
            id: map.id,
            article_intro: content,
          },
          {
            onSuccess: () => {
              Alert.alert(t('editArticle.saved'));
              resolve(true);
            },
            onError: () => {
              Alert.alert(t('common.error'), t('editArticle.saveError'));
              resolve(false);
            },
          }
        );
      });
    },
    [map, updateMap, t]
  );

  // ローディング状態
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('editArticle.intro')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  // マップが見つからない or 権限なし
  if (!map || map.user_id !== currentUserId) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('editArticle.intro')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="lock-closed-outline"
            size={iconSizeNum['3xl']}
            className="text-gray-300"
          />
          <Text className="text-on-surface-variant mt-4">
            {!map ? t('editArticle.mapNotFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ArticleEditor
      title={t('editArticle.intro')}
      initialArticleContent={map.article_intro as ProseMirrorDoc | null}
      onSave={handleSave}
      isSaving={isSaving}
      saveButtonText={t('common.save')}
    />
  );
}
