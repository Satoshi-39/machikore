/**
 * スポット記事編集ページ
 *
 * 単一スポットの記事をリッチエディタで編集する
 */

import { useCallback } from 'react';
import { Alert, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCurrentUserId } from '@/entities/user';
import {
  useSpotWithDetails,
  useSpotImages,
  useUpdateSpot,
} from '@/entities/user-spot/api';
import { ArticleEditor } from '@/features/edit-article';
import { insertSpotImage } from '@/shared/api/supabase/images';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { useQueryClient } from '@tanstack/react-query';
import { colors } from '@/shared/config';
import type { ProseMirrorDoc } from '@/shared/types';
import type { Json } from '@/shared/types/database.types';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { extractName } from '@/shared/lib/utils/multilang.utils';

interface EditSpotArticlePageProps {
  spotId: string;
}

export function EditSpotArticlePage({ spotId }: EditSpotArticlePageProps) {
  const { t, locale } = useI18n();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const { data: spot, isLoading, refetch } = useSpotWithDetails(spotId, currentUserId);
  const { data: images = [], refetch: refetchImages } = useSpotImages(spotId);
  const { mutate: updateSpot, isPending: isSaving } = useUpdateSpot();

  // スポット名を取得（マスタースポットがあればmaster_spot.name、なければspot.name）
  const getSpotName = (): string => {
    if (!spot) return t('editArticle.title');
    // master_spotがある場合
    if (spot.master_spot?.name) {
      return extractName(spot.master_spot.name, locale) || t('editArticle.title');
    }
    // ピン刺し・現在地登録の場合（master_spot_idがnull）
    if (spot.name) {
      return extractName(spot.name as Json, locale) || t('editArticle.title');
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

  // 新規画像アップロード時の処理（imagesテーブルに追加し、画像IDを返す）
  const handleImageUploaded = useCallback(async (imageUrl: string, _imageId: string): Promise<string | null> => {
    if (!spot) return null;

    try {
      // imagesテーブルに追加（DBで生成されたIDを取得）
      // cloud_pathには完全なURLを保存（他の場所と同じ形式）
      const insertedImage = await insertSpotImage({
        user_spot_id: spot.id,
        cloud_path: imageUrl,
        order_index: images.length, // 末尾に追加
      });

      // 画像一覧を再取得
      refetchImages();
      // スポットのimages_countを更新するためキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.spotsDetailWithUser(spot.id, currentUserId),
      });

      // DBで生成された画像IDを返す
      return insertedImage.id;
    } catch (error) {
      Alert.alert(t('common.error'), '画像の保存に失敗しました');
      return null;
    }
  }, [spot, images.length, refetchImages, queryClient, currentUserId, t]);

  // サムネイル変更時の処理
  const handleThumbnailChange = useCallback((imageId: string | null) => {
    if (!spot) return;

    updateSpot(
      {
        spotId: spot.id,
        mapId: spot.map_id,
        thumbnailImageId: imageId,
      },
      {
        onSuccess: () => {
          refetch();
        },
        onError: () => {
          Alert.alert(t('common.error'), 'サムネイルの変更に失敗しました');
        },
      }
    );
  }, [spot, updateSpot, refetch, t]);

  // ImageRow[] を SpotImage[] に変換
  const spotImages = images.map((img, index) => ({
    id: img.id,
    cloud_path: img.cloud_path,
    order_index: img.order_index ?? index,
  }));

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
      title={getSpotName()}
      initialArticleContent={spot?.article_content || null}
      onSave={handleSave}
      isSaving={isSaving}
      isLoading={isLoading}
      saveButtonText={t('common.save')}
      spotId={spotId}
      spotImages={spotImages}
      onImageUploaded={handleImageUploaded}
      thumbnailImageId={spot?.thumbnail_image_id}
      onThumbnailChange={handleThumbnailChange}
    />
  );
}
