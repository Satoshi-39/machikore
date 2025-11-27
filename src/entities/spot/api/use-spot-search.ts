/**
 * スポット検索hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchSpots } from '@/shared/api/sqlite';
import type { SpotWithMasterSpot } from '@/shared/types/database.types';

/**
 * キーワードでスポットを検索
 */
export function useSpotSearch(query: string) {
  return useQuery<SpotWithMasterSpot[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'search', query],
    queryFn: () => searchSpots(query),
    enabled: query.length > 0,
  });
}
