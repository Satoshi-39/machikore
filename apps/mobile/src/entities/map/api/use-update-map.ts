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
    onSuccess: () => {
      // マップ関連の全キャッシュを無効化（名前や設定が変わる可能性があるため）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
    },
  });
}
