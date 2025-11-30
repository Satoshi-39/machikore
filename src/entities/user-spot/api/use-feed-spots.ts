/**
 * フィード用スポット一覧を取得するhook
 *
 * Supabaseから公開スポットを取得
 * 将来的にはレコメンドロジック、人気順、フォロー中ユーザーのスポットなどに置き換え可能
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPublicSpots } from '@/shared/api/supabase';
import type { SpotWithDetails } from '@/shared/types';

/**
 * フィード用スポットを取得（Supabaseから）
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export function useFeedSpots(currentUserId?: string | null, limit: number = 50) {
  return useQuery<SpotWithDetails[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'feed', currentUserId, limit],
    queryFn: () => getPublicSpots(limit, 0, currentUserId),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
