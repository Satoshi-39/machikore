/**
 * ブロック済みユーザーIDリスト取得hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getBlockedUserIds } from '@/shared/api/supabase/blocks';

/**
 * ブロック済みユーザーIDのSetを返す
 */
export function useBlockedUserIds(userId: string | null | undefined) {
  return useQuery<Set<string>, Error>({
    queryKey: QUERY_KEYS.blockedUserIds(userId || ''),
    queryFn: async () => {
      if (!userId) return new Set<string>();
      const ids = await getBlockedUserIds(userId);
      return new Set(ids);
    },
    enabled: !!userId,
  });
}
