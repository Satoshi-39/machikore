/**
 * ユーザー検索hook（RPC版）
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchUsers, type UserSearchResult } from '@/shared/api/supabase';
import { SEARCH_PAGE_SIZE } from '@/shared/config';

/**
 * キーワードでユーザーを検索（発見タブ用、無限スクロール対応）
 * ブロック済みユーザーを除外
 */
export function useUserSearch(query: string, currentUserId?: string) {
  return useInfiniteQuery<UserSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.users, 'search', query, currentUserId],
    queryFn: ({ pageParam }) =>
      searchUsers(query, SEARCH_PAGE_SIZE, currentUserId, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < SEARCH_PAGE_SIZE) return undefined;
      return (lastPageParam as number) + SEARCH_PAGE_SIZE;
    },
    enabled: query.length > 0,
  });
}
