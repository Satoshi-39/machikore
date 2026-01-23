/**
 * スポットショート削除hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSpotShort, deleteImage, STORAGE_BUCKETS } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';

interface DeleteSpotShortParams {
  id: string;
  spotId: string;
  videoUrl: string;
}

/**
 * スポットショートを削除（Storageファイルも削除）
 */
export function useDeleteSpotShort() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteSpotShortParams>({
    mutationFn: async ({ id, videoUrl }) => {
      log.debug(`[SpotShorts] 削除開始: id=${id}`);

      // DBレコードを削除
      await deleteSpotShort(id);

      // Storageからファイルを削除（URLからパスを抽出）
      try {
        const url = new URL(videoUrl);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/spot-shorts\/(.+)/);
        if (pathMatch && pathMatch[1]) {
          const filePath = pathMatch[1];
          await deleteImage(STORAGE_BUCKETS.SPOT_SHORTS, filePath);
          log.debug(`[SpotShorts] Storageファイル削除成功: ${filePath}`);
        }
      } catch (error) {
        // Storageの削除に失敗してもDBは削除済みなので警告のみ
        log.warn('[SpotShorts] Storageファイル削除失敗:', error);
      }
    },
    onSuccess: (_, { spotId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsShorts(spotId) });
    },
  });
}
