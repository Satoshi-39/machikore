/**
 * マップ検索hook（Supabase版）
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchPublicMaps, type MapSearchFilters } from '@/shared/api/supabase';
import { SEARCH_PAGE_SIZE, MAX_PAGES } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';

/**
 * キーワードで公開マップを検索（無限スクロール対応）
 * @param query 検索キーワード
 * @param filters フィルター条件
 */
export function useMapSearch(query: string, filters?: MapSearchFilters, currentUserId?: string | null) {
  return useInfiniteQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsSearch(query), filters, currentUserId],
    queryFn: ({ pageParam }) =>
      searchPublicMaps(query, filters, SEARCH_PAGE_SIZE, currentUserId, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < SEARCH_PAGE_SIZE) return undefined;
      return (lastPageParam as number) + SEARCH_PAGE_SIZE;
    },
    maxPages: MAX_PAGES.SEARCH,
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
