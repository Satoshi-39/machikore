/**
 * マップ検索hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchMaps } from '@/shared/api/sqlite';
import type { MapRow } from '@/shared/types/database.types';

/**
 * キーワードでマップを検索
 */
export function useMapSearch(query: string) {
  return useQuery<MapRow[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'search', query],
    queryFn: () => searchMaps(query),
    enabled: query.length > 0,
  });
}
