/**
 * 予定を作成するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSchedules } from '@/shared/api/query-client';
import { insertSchedule } from '@/shared/api/sqlite';
import {
  createScheduleData,
  validateCreateScheduleParams,
} from '../model';
import type { CreateScheduleParams } from '../model/types';

/**
 * 予定を作成
 */
export function useCreateSchedule() {
  return useMutation({
    mutationFn: async (params: CreateScheduleParams) => {
      // バリデーション
      const validation = validateCreateScheduleParams(params);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 予定を作成
      const newSchedule = createScheduleData(params);
      insertSchedule(newSchedule);

      return newSchedule.id;
    },
    onSuccess: () => {
      invalidateSchedules();
    },
  });
}
