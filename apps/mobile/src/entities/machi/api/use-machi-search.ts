/**
 * 街名検索hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchMachiByName } from '@/shared/api/sqlite';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * 街名で検索
 */
export function useMachiSearch(searchTerm: string) {
  return useQuery<MachiRow[], Error>({
    queryKey: QUERY_KEYS.machiSearch(searchTerm),
    queryFn: () => {
      if (!searchTerm.trim()) return [];
      return searchMachiByName(searchTerm);
    },
    enabled: searchTerm.trim().length > 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5, // 検索結果は5分キャッシュ
  });
}

/** @deprecated Use useMachiSearch instead */
export const useStationSearch = useMachiSearch;
