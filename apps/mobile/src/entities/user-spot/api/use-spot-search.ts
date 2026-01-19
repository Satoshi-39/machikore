/**
 * スポット検索hook（Supabase版）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  searchPublicUserSpots,
  searchPublicSpotsByTag,
  type UserSpotSearchResult,
  type SpotSearchFilters,
} from '@/shared/api/supabase';

/**
 * キーワードで公開スポットを検索
 * @param query 検索キーワード
 * @param filters フィルター条件
 */
export function useSpotSearch(query: string, filters?: SpotSearchFilters) {
  return useQuery<UserSpotSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'search', query, filters],
    queryFn: () => searchPublicUserSpots(query, filters),
    // クエリが空でもフィルターがあれば検索実行
    enabled: query.length > 0 || hasActiveFilters(filters),
    // 検索結果は常に最新を取得
    staleTime: 0,
  });
}

/**
 * タグ名で公開スポットを検索（タグタップ時の検索）
 */
export function useSpotTagSearch(tagName: string) {
  return useQuery<UserSpotSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'search', 'tag', tagName],
    queryFn: () => searchPublicSpotsByTag(tagName),
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
