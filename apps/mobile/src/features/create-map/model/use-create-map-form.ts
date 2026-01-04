/**
 * マップ作成フォームのビジネスロジック
 *
 * FSD: features/create-map/model に配置
 * - データ送信ロジック
 * - 画面遷移
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateMap } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import { log } from '@/shared/config/logger';
import type { CreateMapFormData } from './types';

/**
 * マップ作成フォームのhook
 */
export function useCreateMapForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { mutate: createMap, isPending: isCreating } = useCreateMap();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = useCallback(
    async (data: CreateMapFormData) => {
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
            log.error('[useCreateMapForm] サムネイルアップロードエラー:', result.error);
            Alert.alert('エラー', 'サムネイルのアップロードに失敗しました');
            setIsUploading(false);
            return;
          }
        } catch (error) {
          log.error('[useCreateMapForm] サムネイルアップロードエラー:', error);
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
          categoryId: data.categoryId,
          tags: data.tags,
          isPublic: data.isPublic,
          thumbnailUrl,
        },
        {
          onSuccess: () => {
            Alert.alert('作成完了', 'マップを作成しました', [
              {
                text: 'OK',
                onPress: () => {
                  router.back();
                },
              },
            ]);
          },
          onError: (error) => {
            log.error('[useCreateMapForm] マップ作成エラー:', error);
            Alert.alert('エラー', 'マップの作成に失敗しました');
          },
        }
      );
    },
    [user?.id, createMap, router]
  );

  return {
    handleSubmit,
    isLoading: isCreating || isUploading,
  };
}

