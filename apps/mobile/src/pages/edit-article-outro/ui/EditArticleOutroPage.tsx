/**
 * あとがき編集ページ
 *
 * マップ記事のあとがきをリッチエディタで編集する
 */

import { useCurrentUserId } from '@/entities/user';
import { useMap, useUpdateMap } from '@/entities/map';
import { ArticleEditor } from '@/features/edit-article';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { PageHeader } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import type { ProseMirrorDoc } from '@/shared/types';

interface EditArticleOutroPageProps {
  mapId: string;
}

export function EditArticleOutroPage({ mapId }: EditArticleOutroPageProps) {
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
            article_outro: content,
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
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={t('editArticle.outro')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  // マップが見つからない or 権限なし
  if (!map || map.user_id !== currentUserId) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={t('editArticle.outro')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="lock-closed-outline"
            size={48}
            color={colors.gray[300]}
          />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {!map ? t('editArticle.mapNotFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ArticleEditor
      title={t('editArticle.outro')}
      initialArticleContent={map.article_outro as ProseMirrorDoc | null}
      onSave={handleSave}
      isSaving={isSaving}
      saveButtonText={t('common.save')}
    />
  );
}
