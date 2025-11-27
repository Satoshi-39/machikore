/**
 * ユーザー検索hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchUsers } from '@/shared/api/sqlite';
import type { UserRow } from '@/shared/types/database.types';

/**
 * キーワードでユーザーを検索
 */
export function useUserSearch(query: string) {
  return useQuery<UserRow[], Error>({
    queryKey: [...QUERY_KEYS.users, 'search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
  });
}
