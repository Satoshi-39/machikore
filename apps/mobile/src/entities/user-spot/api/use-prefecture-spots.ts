/**
 * 都道府県別スポット検索hooks
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  getPublicSpotsByPrefecture,
  getPublicSpotsByPrefectureAndCategory,
} from '@/shared/api/supabase/user-spots';
import type { SpotWithDetails } from '@/shared/types';

/**
 * 都道府県IDで公開スポットを検索
 */
export function usePrefectureSpots(
  prefectureId: string,
  currentUserId?: string | null
) {
  return useQuery<SpotWithDetails[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'prefecture', prefectureId, currentUserId],
    queryFn: () => getPublicSpotsByPrefecture(prefectureId, currentUserId),
    enabled: prefectureId.length > 0,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

/**
 * 都道府県ID + カテゴリIDで公開スポットを検索
 */
export function usePrefectureCategorySpots(
  prefectureId: string,
  categoryId: string,
  currentUserId?: string | null
) {
  return useQuery<SpotWithDetails[], Error>({
    queryKey: [
      ...QUERY_KEYS.spots,
      'prefecture-category',
      prefectureId,
      categoryId,
      currentUserId,
    ],
    queryFn: () =>
      getPublicSpotsByPrefectureAndCategory(prefectureId, categoryId, currentUserId),
    enabled: prefectureId.length > 0 && categoryId.length > 0,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
