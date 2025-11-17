/**
 * 単一マップ取得Hook
 */

import { useQuery } from '@tanstack/react-query';
import { getMapById } from '@/shared/api/sqlite/maps';
import type { MapRow } from '@/shared/types/database.types';

export function useMap(mapId: string | null) {
  return useQuery<MapRow | null, Error>({
    queryKey: ['map', mapId],
    queryFn: () => {
      if (!mapId) return null;
      return getMapById(mapId);
    },
    enabled: !!mapId,
  });
}
