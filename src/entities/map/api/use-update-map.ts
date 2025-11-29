/**
 * マップを更新するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMap, type UpdateMapParams } from '@/shared/api/supabase/maps';

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
      queryClient.invalidateQueries({ queryKey: ['maps'] });
      queryClient.invalidateQueries({ queryKey: ['map', data.id] });
      queryClient.invalidateQueries({ queryKey: ['userMaps', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['feed-maps'] });
    },
  });
}
