/**
 * 単一マップ取得Hook
 *
 * Supabaseからマップを取得（ユーザー情報含む）
 */

import { useQuery } from '@tanstack/react-query';
import { getMapById } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

export function useMap(mapId: string | null) {
  return useQuery<MapWithUser | null, Error>({
    queryKey: ['map', mapId],
    queryFn: () => {
      if (!mapId) return null;
      return getMapById(mapId);
    },
    enabled: !!mapId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
