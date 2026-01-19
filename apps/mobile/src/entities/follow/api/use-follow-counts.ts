/**
 * フォロー数取得hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getFollowCounts } from '@/shared/api/supabase/follows';

/**
 * フォロワー数とフォロー中数を取得
 */
export function useFollowCounts(userId: string | null | undefined) {
  return useQuery<{ followers: number; following: number }, Error>({
    queryKey: QUERY_KEYS.followCounts(userId || ''),
    queryFn: () => {
      if (!userId) return { followers: 0, following: 0 };
      return getFollowCounts(userId);
    },
    enabled: !!userId,
  });
}
