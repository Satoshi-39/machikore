/**
 * フォロー状態確認hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { checkIsFollowing } from '@/shared/api/supabase/follows';

/**
 * フォロー状態を確認
 */
export function useIsFollowing(
  followerId: string | null | undefined,
  followeeId: string | null | undefined
) {
  return useQuery<boolean, Error>({
    queryKey: QUERY_KEYS.followStatus(followerId || '', followeeId || ''),
    queryFn: () => {
      if (!followerId || !followeeId) return false;
      return checkIsFollowing(followerId, followeeId);
    },
    enabled: !!followerId && !!followeeId && followerId !== followeeId,
  });
}
