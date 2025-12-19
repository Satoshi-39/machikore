/**
 * マップを更新するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMap, type UpdateMapParams } from '@/shared/api/supabase/maps';
import { QUERY_KEYS } from '@/shared/api/query-client';

/**
 * マップを更新
 */
export function useUpdateMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateMapParams) => {
      return await updateMap(params);
    },
    onSuccess: (data) => {
      // マップ関連のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapsDetail(data.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapsList(data.user_id) });
      queryClient.invalidateQueries({ queryKey: ['feed-maps'] });
      // 記事キャッシュを完全に削除（staleTimeに関係なく次回アクセス時に再取得）
      queryClient.removeQueries({
        queryKey: ['map-article', data.id],
      });
    },
  });
}
