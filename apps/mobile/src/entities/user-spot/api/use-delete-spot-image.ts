/**
 * スポット画像を削除するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSpotImage } from '@/shared/api/supabase/images';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';

interface DeleteSpotImageParams {
  imageId: string;
  spotId: string;
  currentUserId?: string | null;
}

/**
 * スポット画像を削除し、関連するキャッシュを更新
 */
export function useDeleteSpotImage() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteSpotImageParams>({
    mutationFn: async ({ imageId }) => {
      log.debug(`[useDeleteSpotImage] 削除開始: imageId=${imageId}`);
      await deleteSpotImage(imageId);
      log.debug(`[useDeleteSpotImage] 削除完了: imageId=${imageId}`);
    },
    onSuccess: (_result, { spotId, currentUserId }) => {
      // 画像一覧キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsImages(spotId) });
      // スポット詳細キャッシュを無効化（images_count更新のため）
      if (currentUserId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.spotsDetailWithUser(spotId, currentUserId),
        });
      }
    },
    onError: (error) => {
      log.error('[useDeleteSpotImage] 画像削除エラー:', error);
    },
  });
}
