/**
 * 単一マップ取得Hook
 *
 * Supabaseからマップを取得（ユーザー情報含む）
 */

import { useQuery } from '@tanstack/react-query';
import { getMapById } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { MapWithUser } from '@/shared/types';

export function useMap(mapId: string | null, currentUserId?: string | null) {
  return useQuery<MapWithUser | null, Error>({
    queryKey: QUERY_KEYS.mapsDetail(mapId || '', currentUserId),
    queryFn: () => {
      if (!mapId) return null;
      return getMapById(mapId, currentUserId);
    },
    enabled: !!mapId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
