/**
 * マップのスポット一覧を取得するhook
 *
 * Supabaseからスポットを取得（master_spots, users情報含む）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getMapSpots, getPublicMapSpots } from '@/shared/api/supabase';
import type { SpotWithDetails } from '@/shared/types';

/**
 * マップのスポット一覧を取得（Supabaseから）
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 * @param isOwner - マップのオーナーかどうか（オーナーは全スポット、それ以外は公開スポットのみ）
 */
export function useSpots(mapId: string, currentUserId?: string | null, isOwner: boolean = false) {
  return useQuery<SpotWithDetails[], Error>({
    queryKey: [...QUERY_KEYS.spotsList(mapId), currentUserId, isOwner],
    queryFn: () => isOwner
      ? getMapSpots(mapId, currentUserId)
      : getPublicMapSpots(mapId, currentUserId),
    enabled: !!mapId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
