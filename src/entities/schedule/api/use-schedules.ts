/**
 * ユーザーの予定を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getSchedulesByUserId } from '@/shared/api/sqlite';
import type { ScheduleRow } from '@/shared/types/database.types';

/**
 * ユーザーの全予定を取得
 */
export function useSchedules(userId: string) {
  return useQuery<ScheduleRow[], Error>({
    queryKey: QUERY_KEYS.schedulesList(userId),
    queryFn: () => {
      return getSchedulesByUserId(userId);
    },
    enabled: !!userId,
  });
}
