/**
 * マップを削除するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMap } from '@/shared/api/supabase/maps';

/**
 * マップを削除（関連するスポットも自動削除される）
 */
export function useDeleteMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mapId: string) => {
      await deleteMap(mapId);
      return mapId;
    },
    onSuccess: () => {
      // マップ関連のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['maps'] });
      queryClient.invalidateQueries({ queryKey: ['userMaps'] });
      queryClient.invalidateQueries({ queryKey: ['feed-maps'] });
    },
  });
}
