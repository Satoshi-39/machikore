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
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import { getPublicSpotsCount } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import type { EditMapFormData, UseEditMapFormOptions } from './types';

/**
 * マップ編集フォームのhook
 */
export function useEditMapForm({ mapId }: UseEditMapFormOptions) {
  const router = useRouter();
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
        },
        {
          onSuccess: () => {
            // ラベルキャッシュを無効化して再取得させる
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapsLabels(mapId) });

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
    [mapId, user?.id, updateMapTags, updateMap, router, queryClient]
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

