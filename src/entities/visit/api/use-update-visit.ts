/**
 * 訪問記録を更新するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateVisits } from '@/shared/api/query-client';
import { updateVisit } from '@/shared/api/sqlite';
import type { UpdateVisitParams } from '../model/types';

/**
 * 訪問記録を更新
 */
export function useUpdateVisit() {
  return useMutation({
    mutationFn: async (params: UpdateVisitParams) => {
      const now = new Date().toISOString();

      updateVisit(params.visitId, {
        memo: params.memo,
        visited_at: params.visitedAt,
        updated_at: now,
      });

      return params.visitId;
    },
    onSuccess: () => {
      invalidateVisits();
    },
  });
}
