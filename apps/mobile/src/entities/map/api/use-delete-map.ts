/**
 * マップを削除するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
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
      // マップ関連の全キャッシュを無効化（削除なので全リスト更新が必要）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
    },
  });
}
