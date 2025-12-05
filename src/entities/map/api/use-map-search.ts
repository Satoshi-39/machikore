/**
 * マップ検索hook（Supabase版）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchPublicMaps } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

/**
 * キーワードで公開マップを検索（発見タブ用）
 */
export function useMapSearch(query: string) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'search', query],
    queryFn: () => searchPublicMaps(query),
    enabled: query.length > 0,
  });
}
