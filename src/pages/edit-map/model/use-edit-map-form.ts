/**
 * マップ編集フォームのビジネスロジック
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMap, useUpdateMap } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import type { ThumbnailImage } from '@/features/pick-images';

export function useEditMapForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useUserStore((state) => state.user);
  const { data: map, isLoading: isLoadingMap } = useMap(id ?? null);
  const { mutate: updateMap, isPending: isUpdating } = useUpdateMap();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    category?: string;
    tags: string[];
    isPublic: boolean;
    thumbnailImage?: ThumbnailImage;
    removeThumbnail?: boolean;
  }) => {
    if (!id) {
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
          console.error('サムネイルアップロードエラー:', result.error);
          Alert.alert('エラー', 'サムネイルのアップロードに失敗しました');
          setIsUploading(false);
          return;
        }
      } catch (error) {
        console.error('サムネイルアップロードエラー:', error);
        Alert.alert('エラー', 'サムネイルのアップロードに失敗しました');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    } else if (data.removeThumbnail) {
      // サムネイルを削除
      thumbnailUrl = null;
    }

    updateMap(
      {
        id,
        name: data.name,
        description: data.description || null,
        category: data.category || null,
        tags: data.tags.length > 0 ? data.tags : null,
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
          console.error('マップ更新エラー:', error);
          Alert.alert('エラー', 'マップの更新に失敗しました');
        },
      }
    );
  };

  return {
    map,
    isLoading: isLoadingMap,
    isUpdating: isUpdating || isUploading,
    handleSubmit,
  };
}
