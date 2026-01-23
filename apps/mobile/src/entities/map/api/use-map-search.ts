/**
 * マップ検索hook（Supabase版）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchPublicMaps, type MapSearchFilters } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

/**
 * キーワードで公開マップを検索
 * @param query 検索キーワード
 * @param filters フィルター条件
 */
export function useMapSearch(query: string, filters?: MapSearchFilters) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsSearch(query), filters],
    queryFn: () => searchPublicMaps(query, filters),
    // クエリが空でもフィルターがあれば検索実行
    enabled: query.length > 0 || hasActiveFilters(filters),
    // 検索結果は常に最新を取得
    staleTime: 0,
  });
}

/**
 * フィルターが有効かどうかを判定
 */
function hasActiveFilters(filters?: MapSearchFilters): boolean {
  if (!filters) return false;
  return !!(
    (filters.tagIds && filters.tagIds.length > 0) ||
    (filters.dateRange && filters.dateRange !== 'all') ||
    filters.regionText
  );
}
