/**
 * 訪問記録を作成するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateVisits } from '@/shared/api/query-client';
import { createVisit as createVisitApi } from '@/shared/api/supabase/visits';
import { validateCreateVisitParams } from '../model';
import type { CreateVisitParams } from '../model/types';

/**
 * 訪問記録を作成
 */
export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateVisitParams) => {
      // バリデーション
      const validation = validateCreateVisitParams(params);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Supabaseに訪問記録を作成
      const result = await createVisitApi(
        params.userId,
        params.stationId,
        params.visitedAt
      );

      return result.id;
    },
    onSuccess: (_, { userId, stationId }) => {
      // 訪問状態キャッシュを更新
      queryClient.setQueryData<boolean>(
        ['machi-visit-status', userId, stationId],
        true
      );
      // 訪問記録のキャッシュを無効化
      invalidateVisits();
    },
  });
}
