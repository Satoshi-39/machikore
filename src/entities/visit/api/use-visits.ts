/**
 * ユーザーの訪問記録を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getVisitsByUserId } from '@/shared/api/sqlite';
import type { VisitRow } from '@/shared/types/database.types';

/**
 * ユーザーの全訪問記録を取得
 */
export function useVisits(userId: string) {
  return useQuery<VisitRow[], Error>({
    queryKey: QUERY_KEYS.visitsList(userId),
    queryFn: () => {
      return getVisitsByUserId(userId);
    },
    enabled: !!userId,
  });
}
