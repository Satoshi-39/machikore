/**
 * スポット画像をアップロードするhook（Supabase版）
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImage, STORAGE_BUCKETS, insertSpotImage } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { SelectedImage } from '@/features/pick-images';
import type { Database } from '@/shared/types/supabase.generated';
import { log } from '@/shared/config/logger';

type ImageRow = Database['public']['Tables']['images']['Row'];

interface UploadSpotImagesParams {
  spotId: string;
  images: SelectedImage[];
  onProgress?: (current: number, total: number) => void;
}

interface UploadResult {
  uploaded: number;
  failed: number;
  imageRows: ImageRow[];
  spotId: string;
}

/**
 * スポット画像をSupabase Storageにアップロードし、imagesテーブルに保存
 */
export function useUploadSpotImages() {
  const queryClient = useQueryClient();

  return useMutation<UploadResult, Error, UploadSpotImagesParams>({
    mutationFn: async ({ spotId, images, onProgress }) => {
      log.debug(`[Spot] 開始: spotId=${spotId}, images=${images.length}`);

      const uploadedImages: ImageRow[] = [];
      let failed = 0;

      for (let i = 0; i < images.length; i++) {
        const image = images[i]!;
        log.debug(`[Spot] 画像${i}: URI=${image.uri}`);

        // 進捗を報告
        onProgress?.(i + 1, images.length);

        const extension = image.uri.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${i}.${extension}`;
        const path = `${spotId}/${fileName}`;
        log.debug(`[Spot] path=${path}`);

        try {
          // Supabase Storageにアップロード
          const result = await uploadImage({
            uri: image.uri,
            bucket: STORAGE_BUCKETS.SPOT_IMAGES,
            path,
            contentType: `image/${extension === 'png' ? 'png' : 'jpeg'}`,
          });

          if (!result.success) {
            log.error('[Spot] 画像アップロード失敗:', result.error);
            failed++;
            continue;
          }

          // Supabaseのimagesテーブルに保存
          const imageRow = await insertSpotImage({
            user_spot_id: spotId,
            cloud_path: result.data.url,
            local_path: image.uri,
            width: image.width,
            height: image.height,
            file_size: image.fileSize ?? null,
            order_index: i,
          });

          uploadedImages.push(imageRow);
        } catch (error) {
          log.error('[Spot] 画像処理エラー:', error);
          failed++;
        }
      }

      return {
        uploaded: uploadedImages.length,
        failed,
        imageRows: uploadedImages,
        spotId,
      };
    },
    onSuccess: (result) => {
      // 画像キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsImages(result.spotId) });
    },
  });
}
