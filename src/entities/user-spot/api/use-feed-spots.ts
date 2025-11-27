/**
 * フィード用スポット一覧を取得するhook
 *
 * 現在は全公開スポットを新着順で取得
 * 将来的にはレコメンドロジック、人気順、フォロー中ユーザーのスポットなどに置き換え可能
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllPublicSpots } from '@/shared/api/sqlite';
import type { SpotWithMasterSpot } from '@/shared/types/database.types';

/**
 * フィード用スポットを取得
 */
export function useFeedSpots(limit: number = 50) {
  return useQuery<SpotWithMasterSpot[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'feed', limit],
    queryFn: () => getAllPublicSpots(limit),
  });
}
