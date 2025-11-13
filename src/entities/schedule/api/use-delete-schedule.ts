/**
 * 予定を削除するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSchedules } from '@/shared/api/query-client';
import { deleteSchedule } from '@/shared/api/sqlite';

/**
 * 予定を削除
 */
export function useDeleteSchedule() {
  return useMutation({
    mutationFn: async (scheduleId: string) => {
      deleteSchedule(scheduleId);
      return scheduleId;
    },
    onSuccess: () => {
      invalidateSchedules();
    },
  });
}
