/**
 * スポット記事編集ページ
 *
 * 単一スポットの記事をリッチエディタで編集する
 */

import { useCallback } from 'react';
import { Alert, View, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import { useCurrentUserId } from '@/entities/user';
import {
  useSpotWithDetails,
  useSpotImages,
  useUpdateSpot,
} from '@/entities/user-spot/api';
import { ArticleEditor } from '@/features/edit-article';
import type { ProseMirrorDoc } from '@/shared/types';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { extractName } from '@/shared/lib/utils/multilang.utils';

interface EditSpotArticlePageProps {
  spotId: string;
}

export function EditSpotArticlePage({ spotId }: EditSpotArticlePageProps) {
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: spot, isLoading: isLoadingSpot, refetch } = useSpotWithDetails(spotId, currentUserId);
  const { data: images = [], isLoading: isLoadingImages, refetch: refetchImages } = useSpotImages(spotId);
  const isLoading = isLoadingSpot || isLoadingImages;
  const { mutate: updateSpot, isPending: isSaving } = useUpdateSpot();

  // 画面にフォーカスが戻った時にスポットデータを再取得
  // （スポット編集ページでのひとこと変更がサーバーに保存されているため）
  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchImages();
    }, [refetch, refetchImages])
  );

  // スポット名を取得（spot.languageで抽出）
  const getSpotName = (): string => {
    if (!spot) return t('editArticle.title');
    const spotLanguage = spot.language || 'ja';
    // master_spotがある場合（JSONB型をspot.languageで抽出）
    if (spot.master_spot?.name) {
      return extractName(spot.master_spot.name, spotLanguage) || t('editArticle.title');
    }
    // ピン刺し・現在地登録の場合（TEXT型をそのまま使用）
    if (spot.name) {
      return spot.name;
    }
    return t('editArticle.title');
  };

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
            refetch();
            resolve(true);
          },
          onError: () => {
            Alert.alert(t('common.error'), t('editArticle.saveError'));
            resolve(false);
          },
        }
      );
    });
  }, [spot, updateSpot, t, refetch]);

  // description（ひとこと）変更時の処理
  const handleDescriptionChange = useCallback((description: string) => {
    if (!spot) return;

    updateSpot(
      {
        spotId: spot.id,
        mapId: spot.map_id,
        description,
      },
      {
        onError: () => {
          Alert.alert(t('common.error'), 'ひとことの保存に失敗しました');
        },
      }
    );
  }, [spot, updateSpot, t]);

  // ImageRow[] を SpotImage[] に変換
  const spotImages = images.map((img, index) => ({
    id: img.id,
    cloud_path: img.cloud_path,
    order_index: img.order_index ?? index,
    width: img.width,
    height: img.height,
  }));

  // スポットが見つからない or 権限なし
  if (!isLoading && (!spot || spot.user_id !== currentUserId)) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('editArticle.title')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="lock-closed-outline"
            size={iconSizeNum['4xl']}
            className="text-gray-300"
          />
          <Text className="text-on-surface-variant mt-4">
            {!spot ? t('editArticle.spotNotFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ArticleEditor
      title={getSpotName()}
      initialArticleContent={spot?.article_content || null}
      onSave={handleSave}
      isSaving={isSaving}
      isLoading={isLoading}
      saveButtonText={t('common.save')}
      isPublic={spot?.is_public}
      spotImages={spotImages}
      thumbnailImageId={spot?.thumbnail_image_id}
      thumbnailCrop={spot?.thumbnail_crop}
      initialDescription={spot?.description || ''}
      onDescriptionChange={handleDescriptionChange}
    />
  );
}
