/**
 * マップのスポット一覧を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getSpotsByMapId } from '@/shared/api/sqlite';
import type { SpotRow } from '@/shared/types/database.types';

/**
 * マップの全スポットを取得
 */
export function useSpots(mapId: string) {
  return useQuery<SpotRow[], Error>({
    queryKey: QUERY_KEYS.spotsList(mapId),
    queryFn: () => {
      return getSpotsByMapId(mapId);
    },
    enabled: !!mapId,
  });
}
