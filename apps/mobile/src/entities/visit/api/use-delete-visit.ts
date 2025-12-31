/**
 * 訪問記録を削除するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateVisits } from '@/shared/api/query-client';
import { deleteVisit as deleteVisitApi } from '@/shared/api/supabase/visits';

interface DeleteVisitParams {
  userId: string;
  machiId: string;
}

/**
 * 訪問記録を削除
 */
export function useDeleteVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, machiId }: DeleteVisitParams) => {
      await deleteVisitApi(userId, machiId);
      return { userId, machiId };
    },
    onSuccess: (_, { userId, machiId }) => {
      // 訪問状態キャッシュを更新
      queryClient.setQueryData<boolean>(
        ['machi-visit-status', userId, machiId],
        false
      );
      // 訪問記録のキャッシュを無効化
      invalidateVisits();
    },
  });
}
