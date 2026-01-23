/**
 * フォロー状態確認hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { checkIsFollowing } from '@/shared/api/supabase/follows';

/**
 * フォロー状態を確認
 * @param initialData 初期値（JOINで取得済みの場合に渡す、N+1問題回避用）
 */
export function useIsFollowing(
  followerId: string | null | undefined,
  followeeId: string | null | undefined,
  initialData?: boolean
) {
  return useQuery<boolean, Error>({
    queryKey: QUERY_KEYS.followStatus(followerId || '', followeeId || ''),
    queryFn: () => {
      if (!followerId || !followeeId) return false;
      return checkIsFollowing(followerId, followeeId);
    },
    enabled: !!followerId && !!followeeId && followerId !== followeeId,
    initialData,
    // initialDataがある場合、キャッシュが古くてもすぐに再取得しない
    // 楽観的更新でキャッシュが更新された場合はそちらを使う
    staleTime: initialData !== undefined ? 1000 * 60 * 5 : 0, // 5分
  });
}
