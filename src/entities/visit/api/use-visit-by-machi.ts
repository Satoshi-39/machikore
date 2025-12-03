/**
 * 特定の街の訪問記録を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getVisitByUserAndMachi } from '@/shared/api/supabase/visits';

/**
 * 特定の街の訪問記録を取得
 */
export function useVisitByMachi(userId: string | null | undefined, machiId: string | null | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.visitsMachi(userId || '', machiId || ''),
    queryFn: () => {
      if (!userId || !machiId) return null;
      return getVisitByUserAndMachi(userId, machiId);
    },
    enabled: !!userId && !!machiId,
  });
}
