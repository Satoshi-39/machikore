/**
 * マップ編集フォームのビジネスロジック
 *
 * FSD: features/edit-map/model に配置
 * - データ取得・更新ロジック
 * - フォーム状態管理
 * - バリデーション
 */

import { useState, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMap, useUpdateMap } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { useMapTags, useUpdateMapTags } from '@/entities/tag';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import type { ThumbnailImage } from '@/features/pick-images';
import { log } from '@/shared/config/logger';

export interface EditMapFormData {
  name: string;
  description: string;
  categoryId: string;
  tags: string[];
  isPublic: boolean;
  thumbnailImage?: ThumbnailImage;
  removeThumbnail?: boolean;
}

interface UseEditMapFormOptions {
  mapId: string;
}

/**
 * マップ編集フォームのhook
 */
export function useEditMapForm({ mapId }: UseEditMapFormOptions) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: map, isLoading: isLoadingMap } = useMap(mapId);
  const { data: mapTags = [], isLoading: isLoadingTags } = useMapTags(mapId);
  const { mutate: updateMap, isPending: isUpdating } = useUpdateMap();
  const { mutateAsync: updateMapTags } = useUpdateMapTags();
  const [isUploading, setIsUploading] = useState(false);

  // タグ名の配列を取得
  const initialTags = useMemo(() => mapTags.map((tag) => tag.name), [mapTags]);

  const handleSubmit = useCallback(
    async (data: EditMapFormData) => {
      if (!mapId) {
        Alert.alert('エラー', 'マップIDが見つかりません');
        return;
      }

      if (!user?.id) {
        Alert.alert('エラー', 'ユーザー情報が取得できません');
        return;
      }

      let thumbnailUrl: string | null | undefined = undefined;

      // 新しいサムネイル画像のアップロード
      if (data.thumbnailImage) {
        setIsUploading(true);
        try {
          const timestamp = Date.now();
          const path = `${user.id}/${timestamp}.jpg`;
          const result = await uploadImage({
            uri: data.thumbnailImage.uri,
            bucket: STORAGE_BUCKETS.MAP_THUMBNAILS,
            path,
          });

          if (result.success) {
            thumbnailUrl = result.data.url;
          } else {
            log.error('[useEditMapForm] サムネイルアップロードエラー:', result.error);
            Alert.alert('エラー', 'サムネイルのアップロードに失敗しました');
            setIsUploading(false);
            return;
          }
        } catch (error) {
          log.error('[useEditMapForm] サムネイルアップロードエラー:', error);
          Alert.alert('エラー', 'サムネイルのアップロードに失敗しました');
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      } else if (data.removeThumbnail) {
        // サムネイルを削除
        thumbnailUrl = null;
      }

      // タグを中間テーブルに保存
      try {
        await updateMapTags({ mapId, tagNames: data.tags });
      } catch (error) {
        log.error('[useEditMapForm] タグ更新エラー:', error);
        // タグ更新エラーは警告のみで続行
      }

      updateMap(
        {
          id: mapId,
          name: data.name,
          description: data.description || null,
          category_id: data.categoryId || null,
          is_public: data.isPublic,
          ...(thumbnailUrl !== undefined && { thumbnail_url: thumbnailUrl }),
        },
        {
          onSuccess: () => {
            Alert.alert('更新完了', 'マップを更新しました', [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]);
          },
          onError: (error) => {
            log.error('[useEditMapForm] マップ更新エラー:', error);
            Alert.alert('エラー', 'マップの更新に失敗しました');
          },
        }
      );
    },
    [mapId, user?.id, updateMapTags, updateMap, router]
  );

  return {
    map,
    initialTags,
    isLoading: isLoadingMap || isLoadingTags,
    isUpdating: isUpdating || isUploading,
    handleSubmit,
  };
}

