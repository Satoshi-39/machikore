/**
 * 訪問記録を削除するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateVisits, invalidatePosts } from '@/shared/api/query-client';
import { deleteVisit } from '@/shared/api/sqlite';

/**
 * 訪問記録を削除（関連する投稿も連鎖削除される）
 */
export function useDeleteVisit() {
  return useMutation({
    mutationFn: async (visitId: string) => {
      deleteVisit(visitId);
      return visitId;
    },
    onSuccess: () => {
      // 訪問記録と投稿のキャッシュを無効化
      invalidateVisits();
      invalidatePosts();
    },
  });
}
