/**
 * マップ記事用hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { log } from '@/shared/config/logger';
import { getMapArticle, updateSpotArticleContent } from '@/shared/api/supabase';
import type { MapArticleData } from '@/shared/types';

/**
 * マップ記事データを取得
 */
export function useMapArticle(mapId: string | null, currentUserId?: string | null) {
  return useQuery<MapArticleData | null, Error>({
    queryKey: ['map-article', mapId, currentUserId],
    queryFn: () => {
      if (!mapId) return null;
      return getMapArticle(mapId, currentUserId);
    },
    enabled: !!mapId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

interface UpdateSpotArticleParams {
  spotId: string;
  articleContent: string | null;
  mapId: string;
}

/**
 * スポットの記事内容を更新
 */
export function useUpdateSpotArticle() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateSpotArticleParams>({
    mutationFn: ({ spotId, articleContent }) =>
      updateSpotArticleContent(spotId, articleContent),
    onSuccess: (_, { mapId }) => {
      // マップ記事データを再取得
      queryClient.invalidateQueries({ queryKey: ['map-article', mapId] });

      Toast.show({
        type: 'success',
        text1: '記事を保存しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Map] useUpdateSpotArticle Error:', error);
      Toast.show({
        type: 'error',
        text1: '記事の保存に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}
