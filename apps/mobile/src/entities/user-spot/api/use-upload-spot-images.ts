/**
 * スポット画像をアップロードするhook（Supabase版）
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resizeAndUploadImage, STORAGE_BUCKETS, insertSpotImage } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { SelectedImage } from '@/features/pick-images';
import type { ImageRow } from '@/shared/types';
import { log } from '@/shared/config/logger';

interface UploadSpotImagesParams {
  spotId: string;
  images: SelectedImage[];
  /** 既存画像の数（order_indexの開始位置に使用） */
  existingImagesCount?: number;
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
    mutationFn: async ({ spotId, images, existingImagesCount = 0, onProgress }) => {
      log.debug(`[Spot] 開始: spotId=${spotId}, images=${images.length}, existingCount=${existingImagesCount}`);

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
          // リサイズしてSupabase Storageにアップロード
          const result = await resizeAndUploadImage({
            uri: image.uri,
            bucket: STORAGE_BUCKETS.SPOT_IMAGES,
            path,
          });

          if (!result.success) {
            log.error('[Spot] 画像アップロード失敗:', result.error);
            failed++;
            continue;
          }

          // Supabaseのimagesテーブルに保存
          // order_indexは既存画像の数 + ループインデックス
          const imageRow = await insertSpotImage({
            user_spot_id: spotId,
            cloud_path: result.data.url,
            local_path: image.uri,
            width: image.width,
            height: image.height,
            file_size: image.fileSize ?? null,
            order_index: existingImagesCount + i,
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
