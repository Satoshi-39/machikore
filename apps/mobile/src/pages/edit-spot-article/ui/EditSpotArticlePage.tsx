/**
 * スポット記事編集ページ
 *
 * 単一スポットの記事をリッチエディタで編集する
 */

import { useCallback } from 'react';
import { Alert, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCurrentUserId } from '@/entities/user';
import { useSpotWithDetails, useUpdateSpot } from '@/entities/user-spot/api';
import { ArticleEditor } from '@/features/edit-article';
import { colors } from '@/shared/config';
import type { ProseMirrorDoc } from '@/shared/types';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

interface EditSpotArticlePageProps {
  spotId: string;
}

export function EditSpotArticlePage({ spotId }: EditSpotArticlePageProps) {
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: spot, isLoading } = useSpotWithDetails(spotId, currentUserId);
  const { mutate: updateSpot, isPending: isSaving } = useUpdateSpot();

  const handleSave = useCallback(async (content: ProseMirrorDoc | null): Promise<boolean> => {
    if (!spot) return false;

    return new Promise((resolve) => {
      updateSpot(
        {
          spotId: spot.id,
          articleContent: content,
          mapId: spot.map_id,
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
  }, [spot, updateSpot, t]);

  // スポットが見つからない or 権限なし
  if (!isLoading && (!spot || spot.user_id !== currentUserId)) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={t('editArticle.title')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="lock-closed-outline"
            size={48}
            color={colors.gray[300]}
          />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {!spot ? t('editArticle.spotNotFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ArticleEditor
      title={spot?.description || t('editArticle.title')}
      initialArticleContent={spot?.article_content || null}
      onSave={handleSave}
      isSaving={isSaving}
      isLoading={isLoading}
      saveButtonText={t('common.save')}
    />
  );
}
