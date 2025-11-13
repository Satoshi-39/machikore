/**
 * 予定を更新するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSchedules } from '@/shared/api/query-client';
import { updateSchedule } from '@/shared/api/sqlite';
import type { UpdateScheduleParams } from '../model/types';

/**
 * 予定を更新
 */
export function useUpdateSchedule() {
  return useMutation({
    mutationFn: async (params: UpdateScheduleParams) => {
      const now = new Date().toISOString();

      updateSchedule(params.scheduleId, {
        scheduled_at: params.scheduledAt,
        title: params.title,
        memo: params.memo,
        is_completed: params.isCompleted !== undefined ? (params.isCompleted ? 1 : 0) : undefined,
        completed_at:
          params.isCompleted === true
            ? now
            : params.isCompleted === false
              ? null
              : undefined,
        updated_at: now,
      });

      return params.scheduleId;
    },
    onSuccess: () => {
      invalidateSchedules();
    },
  });
}
