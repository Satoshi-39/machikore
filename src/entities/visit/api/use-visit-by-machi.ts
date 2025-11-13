/**
 * 特定の街の訪問記録を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getVisitByUserAndMachi } from '@/shared/api/sqlite';
import type { VisitRow } from '@/shared/types/database.types';

/**
 * 特定の街の訪問記録を取得
 */
export function useVisitByMachi(userId: string, machiId: string) {
  return useQuery<VisitRow | null, Error>({
    queryKey: QUERY_KEYS.visitsMachi(userId, machiId),
    queryFn: () => {
      return getVisitByUserAndMachi(userId, machiId);
    },
    enabled: !!userId && !!machiId,
  });
}
