/**
 * 月別予定を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getSchedulesByMonth } from '@/shared/api/sqlite';
import type { ScheduleRow } from '@/shared/types/database.types';

/**
 * 指定月の予定を取得
 */
export function useMonthlySchedules(
  userId: string,
  year: number,
  month: number
) {
  return useQuery<ScheduleRow[], Error>({
    queryKey: QUERY_KEYS.schedulesMonth(userId, year, month),
    queryFn: () => {
      return getSchedulesByMonth(userId, year, month);
    },
    enabled: !!userId && !!year && !!month,
  });
}
