/**
 * マップ記事用hooks
 */

import { useQuery } from '@tanstack/react-query';
import { getMapArticle } from '@/shared/api/supabase';
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
