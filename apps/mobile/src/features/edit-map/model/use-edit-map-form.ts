/**
 * マップ編集フォームのビジネスロジック
 *
 * FSD: features/edit-map/model に配置
 * - データ取得・更新ロジック
 * - フォーム状態管理
 * - バリデーション
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useMap, useUpdateMap } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { useMapTags, useUpdateMapTags } from '@/entities/tag';
import { createMapLabel, updateMapLabel, deleteMapLabel } from '@/entities/map-label';
import { resizeAndUploadImage, deleteImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import { getPublicSpotsCount } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import type { ThumbnailCrop } from '@/shared/lib/image';
import type { EditMapFormData, UseEditMapFormOptions } from './types';

/**
 * マップ編集フォームのhook
 */
export function useEditMapForm({ mapId }: UseEditMapFormOptions) {
  const router = useRouter();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const { data: map, isLoading: isLoadingMap } = useMap(mapId);
  const { data: mapTags = [], isLoading: isLoadingTags } = useMapTags(mapId);
  const { mutate: updateMap, isPending: isUpdating } = useUpdateMap();
  const { mutateAsync: updateMapTags } = useUpdateMapTags();
  const [isUploading, setIsUploading] = useState(false);
  const [publicSpotsCount, setPublicSpotsCount] = useState<number>(0);
  const [isLoadingPublicSpotsCount, setIsLoadingPublicSpotsCount] = useState(true);

  // 公開スポット数を取得
  useEffect(() => {
    if (!mapId) return;

    setIsLoadingPublicSpotsCount(true);
    getPublicSpotsCount(mapId)
      .then((count) => {
        setPublicSpotsCount(count);
      })
      .catch((error) => {
        log.error('[useEditMapForm] 公開スポット数取得エラー:', error);
        setPublicSpotsCount(0);
      })
      .finally(() => {
        setIsLoadingPublicSpotsCount(false);
      });
  }, [mapId]);

  // タグ名の配列を取得
  const initialTags = useMemo(() => mapTags.map((tag) => tag.name), [mapTags]);

  const handleSubmit = useCallback(
    async (data: EditMapFormData) => {
      if (!mapId) {
        Alert.alert(t('common.error'), t('map.mapIdNotFound'));
        return;
      }

      if (!user?.id) {
        Alert.alert(t('common.error'), t('map.userNotFound'));
        return;
      }

      let thumbnailUrl: string | null | undefined = undefined;
      let thumbnailCrop: ThumbnailCrop | null | undefined = data.thumbnailImage?.cropRegion ?? undefined;

      // 既存のサムネイルURLからパスを抽出するヘルパー関数
      const extractPathFromUrl = (url: string): string | null => {
        try {
          const pattern = new RegExp(`/storage/v1/object/public/${STORAGE_BUCKETS.MAP_THUMBNAILS}/(.+)$`);
          const match = url.match(pattern);
          return match?.[1] ?? null;
        } catch {
          return null;
        }
      };

      // 古いサムネイルをS3から削除するヘルパー関数
      const deleteOldThumbnail = async () => {
        if (map?.thumbnail_url) {
          const oldPath = extractPathFromUrl(map.thumbnail_url);
          if (oldPath) {
            const deleteResult = await deleteImage(STORAGE_BUCKETS.MAP_THUMBNAILS, oldPath);
            if (!deleteResult.success) {
              log.warn('[useEditMapForm] 古いサムネイルのS3削除に失敗しましたが、処理は続行します:', deleteResult.error);
            } else {
              log.debug('[useEditMapForm] 古いサムネイルをS3から削除:', oldPath);
            }
          }
        }
      };

      // 新しいサムネイル画像のアップロード（元画像をアップロード）
      if (data.thumbnailImage) {
        setIsUploading(true);
        try {
          // 古いサムネイルがあればS3から削除
          await deleteOldThumbnail();

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
            log.error('[useEditMapForm] サムネイルアップロードエラー:', result.error);
            Alert.alert(t('common.error'), t('map.thumbnailUploadFailed'));
            setIsUploading(false);
            return;
          }
        } catch (error) {
          log.error('[useEditMapForm] サムネイルアップロードエラー:', error);
          Alert.alert(t('common.error'), t('map.thumbnailUploadFailed'));
          setIsUploading(false);
          return;
        }
        // NOTE: isUploadingはupdateMapの完了後にリセットする
        // ここでfalseにするとupdateMap呼び出しまでの間にボタンが一瞬活性化する
      } else if (data.removeThumbnail) {
        // サムネイルを削除（S3からも削除）
        await deleteOldThumbnail();
        thumbnailUrl = null;
        thumbnailCrop = null;
      }

      // タグを中間テーブルに保存
      try {
        await updateMapTags({ mapId, tagNames: data.tags });
      } catch (error) {
        log.error('[useEditMapForm] タグ更新エラー:', error);
        // タグ更新エラーは警告のみで続行
      }

      // ラベルの保存（追加・更新・削除）
      if (data.labels) {
        try {
          // 削除予定のラベルを削除
          const labelsToDelete = data.labels.filter((l) => l.isDeleted && !l.isNew);
          for (const label of labelsToDelete) {
            await deleteMapLabel(label.id);
          }

          // 新規ラベルを作成
          const labelsToCreate = data.labels.filter((l) => l.isNew && !l.isDeleted);
          for (const label of labelsToCreate) {
            await createMapLabel({
              map_id: mapId,
              name: label.name,
              color: label.color,
              sort_order: label.sort_order,
            });
          }

          // 変更されたラベルを更新
          const labelsToUpdate = data.labels.filter((l) => l.isModified && !l.isDeleted && !l.isNew);
          for (const label of labelsToUpdate) {
            await updateMapLabel(label.id, {
              name: label.name,
              color: label.color,
            });
          }
        } catch (error) {
          log.error('[useEditMapForm] ラベル更新エラー:', error);
          // ラベル更新エラーは警告のみで続行
        }
      }

      updateMap(
        {
          id: mapId,
          name: data.name,
          description: data.description || null,
          category_id: data.categoryId || null,
          is_public: data.isPublic,
          show_label_chips: data.showLabelChips,
          ...(thumbnailUrl !== undefined && { thumbnail_url: thumbnailUrl }),
          ...(thumbnailCrop !== undefined && { thumbnail_crop: thumbnailCrop }),
        },
        {
          onSuccess: () => {
            setIsUploading(false);
            // ラベルキャッシュを無効化して再取得させる
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapsLabels(mapId) });

            Alert.alert(t('map.updateComplete'), t('map.updateSuccess'), [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]);
          },
          onError: (error) => {
            setIsUploading(false);
            log.error('[useEditMapForm] マップ更新エラー:', error);
            Alert.alert(t('common.error'), t('map.updateFailed'));
          },
        }
      );
    },
    [mapId, user?.id, updateMapTags, updateMap, router, queryClient, t]
  );

  return {
    map,
    initialTags,
    isLoading: isLoadingMap || isLoadingTags || isLoadingPublicSpotsCount,
    isUpdating: isUpdating || isUploading,
    publicSpotsCount,
    handleSubmit,
  };
}

