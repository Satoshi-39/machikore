/**
 * スポットを削除するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSpots } from '@/shared/api/query-client';
import { deleteSpot } from '@/shared/api/sqlite';

/**
 * スポットを削除（関連する画像も連鎖削除される）
 */
export function useDeleteSpot() {
  return useMutation({
    mutationFn: async (spotId: string) => {
      deleteSpot(spotId);
      return spotId;
    },
    onSuccess: () => {
      invalidateSpots();
    },
  });
}
