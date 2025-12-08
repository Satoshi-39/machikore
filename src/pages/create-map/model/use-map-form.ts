/**
 * マップ作成フォームのビジネスロジック
 *
 * エラーハンドリング、データ送信、画面遷移を管理
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateMap } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import type { ThumbnailImage } from '@/features/pick-images';
import type { UserMapThemeColor } from '@/shared/config';

export function useMapForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { mutate: createMap, isPending: isCreating } = useCreateMap();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    category?: string;
    tags: string[];
    isPublic: boolean;
    thumbnailImage?: ThumbnailImage;
    themeColor: UserMapThemeColor;
  }) => {
    if (!user?.id) {
      Alert.alert('エラー', 'ユーザー情報が取得できません');
      return;
    }

    let thumbnailUrl: string | undefined;

    // サムネイル画像のアップロード
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
    }

    // マップ作成
    createMap(
      {
        userId: user.id,
        name: data.name,
        description: data.description,
        category: data.category,
        tags: data.tags,
        isPublic: data.isPublic,
        thumbnailUrl,
        themeColor: data.themeColor,
      },
      {
        onSuccess: () => {
          Alert.alert('作成完了', 'マップを作成しました', [
            {
              text: 'OK',
              onPress: () => {
                // マップ作成画面を閉じて前のページに戻る
                router.back();
              },
            },
          ]);
        },
        onError: (error) => {
          console.error('マップ作成エラー:', error);
          Alert.alert('エラー', 'マップの作成に失敗しました');
        },
      }
    );
  };

  return {
    handleSubmit,
    isLoading: isCreating || isUploading,
  };
}
