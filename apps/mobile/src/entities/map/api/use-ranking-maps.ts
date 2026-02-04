/**
 * ランキングマップ取得hooks
 * マテリアライズドビュー（mv_popular_maps, mv_today_picks_maps, mv_recommend_maps）を使用
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { fetchPopularMaps, fetchTodayPicksMaps, fetchRecommendMaps } from '@/shared/api/supabase/maps';
import type { MapWithUser } from '@/shared/types';

/**
 * 人気マップを取得するhook
 */
export function usePopularMaps(limit: number = 10, currentUserId?: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsPopular(limit), currentUserId],
    queryFn: () => fetchPopularMaps(limit, currentUserId),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

/**
 * 本日のピックアップマップを取得するhook
 */
export function useTodayPicksMaps(limit: number = 10, currentUserId?: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsTodayPicks(limit), currentUserId],
    queryFn: () => fetchTodayPicksMaps(limit, currentUserId),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

/**
 * カテゴリ別おすすめマップを取得するhook
 */
export function useRecommendMaps(categoryId: string, currentUserId?: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.featuredCategoryMaps(categoryId), currentUserId],
    queryFn: () => fetchRecommendMaps(categoryId, currentUserId),
    enabled: categoryId.length > 0,
    staleTime: 5 * 60 * 1000, // 5分
  });
}
