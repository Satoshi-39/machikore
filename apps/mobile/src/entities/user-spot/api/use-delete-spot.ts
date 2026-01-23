/**
 * スポットを削除するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateSpots, QUERY_KEYS } from '@/shared/api/query-client';
import { deleteSpot } from '@/shared/api/supabase/user-spots';

/**
 * スポットを削除（関連する画像も連鎖削除される）
 */
export function useDeleteSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (spotId: string) => {
      await deleteSpot(spotId);
      return spotId;
    },
    onSuccess: () => {
      // スポット関連の全キャッシュを無効化
      invalidateSpots();
      // マップ関連も無効化（スポット数が変わる）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
    },
  });
}
