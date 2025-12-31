/**
 * ユーザー検索hook（Supabase版）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchUsers, type UserSearchResult } from '@/shared/api/supabase';

/**
 * キーワードでユーザーを検索（発見タブ用）
 */
export function useUserSearch(query: string) {
  return useQuery<UserSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.users, 'search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
  });
}
