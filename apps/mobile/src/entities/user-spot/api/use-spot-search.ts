/**
 * スポット検索hook（Supabase版）
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  searchPublicUserSpots,
  getTagByName,
  type UserSpotSearchResult,
  type SpotSearchFilters,
} from '@/shared/api/supabase';
import { SEARCH_PAGE_SIZE, MAX_PAGES } from '@/shared/config';

/**
 * キーワードで公開スポットを検索（無限スクロール対応）
 * @param query 検索キーワード
 * @param filters フィルター条件
 */
export function useSpotSearch(query: string, filters?: SpotSearchFilters, currentUserId?: string | null) {
  return useInfiniteQuery<UserSpotSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'search', query, filters, currentUserId],
    queryFn: ({ pageParam }) =>
      searchPublicUserSpots(query, filters, SEARCH_PAGE_SIZE, currentUserId, pageParam as number),
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
 * タグ名で公開スポットを検索（タグタップ時の検索、無限スクロール対応）
 * @param tagName タグ名
 * @param filters フィルター条件
 */
export function useSpotTagSearch(tagName: string, filters?: SpotSearchFilters, currentUserId?: string | null) {
  return useInfiniteQuery<UserSpotSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'search', 'tag', tagName, filters, currentUserId],
    queryFn: async ({ pageParam }) => {
      // タグ名からタグIDを取得
      const tag = await getTagByName(tagName);
      if (!tag) return [];

      // tag_ids_filterにタグIDを追加してRPCで検索
      return searchPublicUserSpots('', {
        ...filters,
        tagIds: [tag.id],
      }, SEARCH_PAGE_SIZE, currentUserId, pageParam as number);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < SEARCH_PAGE_SIZE) return undefined;
      return (lastPageParam as number) + SEARCH_PAGE_SIZE;
    },
    maxPages: MAX_PAGES.SEARCH,
    enabled: tagName.length > 0,
    staleTime: 0,
  });
}

/**
 * フィルターが有効かどうかを判定
 */
function hasActiveFilters(filters?: SpotSearchFilters): boolean {
  if (!filters) return false;
  return !!(
    filters.prefectureId ||
    filters.cityId ||
    (filters.tagIds && filters.tagIds.length > 0) ||
    (filters.dateRange && filters.dateRange !== 'all')
  );
}
