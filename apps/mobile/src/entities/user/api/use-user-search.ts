/**
 * ユーザー検索hook（RPC版）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchUsers, type UserSearchResult } from '@/shared/api/supabase';

/**
 * キーワードでユーザーを検索（発見タブ用）
 * ブロック済みユーザーを除外
 */
export function useUserSearch(query: string, currentUserId?: string) {
  return useQuery<UserSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.users, 'search', query, currentUserId],
    queryFn: () => searchUsers(query, 30, currentUserId),
    enabled: query.length > 0,
  });
}
