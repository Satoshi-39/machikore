/**
 * スポットを削除するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSpots, invalidateMaps } from '@/shared/api/query-client';
import { deleteSpot } from '@/shared/api/supabase/user-spots';

/**
 * スポットを削除（関連する画像も連鎖削除される）
 */
export function useDeleteSpot() {
  return useMutation({
    mutationFn: async (spotId: string) => {
      await deleteSpot(spotId);
      return spotId;
    },
    onSuccess: () => {
      invalidateSpots();
      invalidateMaps(); // spots_countを更新するためにマップキャッシュも無効化
    },
  });
}
