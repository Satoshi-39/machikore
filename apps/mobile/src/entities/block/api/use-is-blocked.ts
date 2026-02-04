/**
 * ブロック状態確認hook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { checkIsBlocked } from '@/shared/api/supabase/blocks';

/**
 * 指定ユーザーをブロック中かどうかを確認
 */
export function useIsBlocked(
  blockerId: string | null | undefined,
  blockedId: string | null | undefined
) {
  return useQuery<boolean, Error>({
    queryKey: QUERY_KEYS.blockStatus(blockerId || '', blockedId || ''),
    queryFn: () => {
      if (!blockerId || !blockedId) return false;
      return checkIsBlocked(blockerId, blockedId);
    },
    enabled: !!blockerId && !!blockedId && blockerId !== blockedId,
  });
}
