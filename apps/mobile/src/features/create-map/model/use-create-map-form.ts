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
import { resizeAndUploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import type { CreateMapFormData } from './types';

/**
 * マップ作成フォームのhook
 */
export function useCreateMapForm() {
  const router = useRouter();
  const { t } = useI18n();
  const user = useUserStore((state) => state.user);
  const { mutate: createMap, isPending: isCreating } = useCreateMap();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = useCallback(
    async (data: CreateMapFormData) => {
      if (!user?.id) {
        Alert.alert(t('common.error'), t('map.userNotFound'));
        return;
      }

      let thumbnailUrl: string | undefined;
      let thumbnailCrop = data.thumbnailImage?.cropRegion ?? undefined;

      // サムネイル画像のアップロード（元画像をアップロード）
      if (data.thumbnailImage) {
        setIsUploading(true);
        try {
          // 元画像URI（originalUriがあればそちらを使用）
          const uploadUri = data.thumbnailImage.originalUri ?? data.thumbnailImage.uri;
          const timestamp = Date.now();
          const path = `${user.id}/${timestamp}.jpg`;
          const result = await resizeAndUploadImage({
            uri: uploadUri,
            bucket: STORAGE_BUCKETS.MAP_THUMBNAILS,
            path,
          });

          if (result.success) {
            thumbnailUrl = result.data.url;
          } else {
            log.error('[useCreateMapForm] サムネイルアップロードエラー:', result.error);
            Alert.alert(t('common.error'), t('map.thumbnailUploadFailed'));
            setIsUploading(false);
            return;
          }
        } catch (error) {
          log.error('[useCreateMapForm] サムネイルアップロードエラー:', error);
          Alert.alert(t('common.error'), t('map.thumbnailUploadFailed'));
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
          thumbnailCrop,
        },
        {
          onSuccess: () => {
            Alert.alert(t('map.createComplete'), t('map.createSuccess'), [
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
            Alert.alert(t('common.error'), t('map.createFailed'));
          },
        }
      );
    },
    [user?.id, createMap, router, t]
  );

  return {
    handleSubmit,
    isLoading: isCreating || isUploading,
  };
}

