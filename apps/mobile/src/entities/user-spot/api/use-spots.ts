/**
 * マップのスポット一覧を取得するhook
 *
 * Supabaseからスポットを取得（master_spots, users情報含む）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getMapSpots } from '@/shared/api/supabase';
import type { SpotWithDetails } from '@/shared/types';

/**
 * マップの全スポットを取得（Supabaseから）
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export function useSpots(mapId: string, currentUserId?: string | null) {
  return useQuery<SpotWithDetails[], Error>({
    queryKey: [...QUERY_KEYS.spotsList(mapId), currentUserId],
    queryFn: () => getMapSpots(mapId, currentUserId),
    enabled: !!mapId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
