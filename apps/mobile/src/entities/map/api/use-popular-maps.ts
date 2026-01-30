/**
 * 人気マップ取得hooks
 * マテリアライズドビュー（mv_popular_maps, mv_today_picks_maps）を使用
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { fetchPopularMaps, fetchTodayPicksMaps } from '@/shared/api/supabase/maps';
import type { MapWithUser } from '@/shared/types';

/**
 * 人気マップを取得するhook
 * @param currentUserId 現在のユーザーID（いいね状態を取得するため）
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
 * @param currentUserId 現在のユーザーID（いいね状態を取得するため）
 */
export function useTodayPicksMaps(limit: number = 10, currentUserId?: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsTodayPicks(limit), currentUserId],
    queryFn: () => fetchTodayPicksMaps(limit, currentUserId),
    staleTime: 5 * 60 * 1000, // 5分
  });
}
