/**
 * ユーザーの訪問記録を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getVisitsByUserId } from '@/shared/api/supabase/visits';

/**
 * ユーザーの全訪問記録を取得
 */
export function useVisits(userId: string | null | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.visitsList(userId || ''),
    queryFn: () => {
      if (!userId) return [];
      return getVisitsByUserId(userId);
    },
    enabled: !!userId,
  });
}
