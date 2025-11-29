/**
 * スポット画像をアップロードするhook
 */

import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase';
import { insertSpotImage } from '@/shared/api/sqlite';
import type { SelectedImage } from '@/features/pick-images';
import type { ImageRow } from '@/shared/types/database.types';

interface UploadSpotImagesParams {
  spotId: string;
  images: SelectedImage[];
}

interface UploadResult {
  uploaded: number;
  failed: number;
  imageRows: ImageRow[];
}

/**
 * スポット画像をSupabase Storageにアップロードし、ローカルDBに保存
 */
export function useUploadSpotImages() {
  return useMutation<UploadResult, Error, UploadSpotImagesParams>({
    mutationFn: async ({ spotId, images }) => {
      const now = new Date().toISOString();
      const uploadedImages: ImageRow[] = [];
      let failed = 0;

      for (let i = 0; i < images.length; i++) {
        const image = images[i]!;
        const imageId = uuidv4();
        const extension = image.uri.split('.').pop() || 'jpg';
        const path = `${spotId}/${imageId}.${extension}`;

        try {
          // Supabase Storageにアップロード
          const result = await uploadImage({
            uri: image.uri,
            bucket: STORAGE_BUCKETS.SPOT_IMAGES,
            path,
            contentType: `image/${extension === 'png' ? 'png' : 'jpeg'}`,
          });

          if (!result.success) {
            console.error('画像アップロード失敗:', result.error);
            failed++;
            continue;
          }

          // ローカルDBに保存
          const imageRow: ImageRow = {
            id: imageId,
            spot_id: spotId,
            local_path: image.uri,
            cloud_path: result.data.url,
            width: image.width,
            height: image.height,
            file_size: image.fileSize ?? null,
            order_index: i,
            created_at: now,
            updated_at: now,
            synced_at: now,
            is_synced: 1,
          };

          insertSpotImage(imageRow);
          uploadedImages.push(imageRow);
        } catch (error) {
          console.error('画像処理エラー:', error);
          failed++;
        }
      }

      return {
        uploaded: uploadedImages.length,
        failed,
        imageRows: uploadedImages,
      };
    },
  });
}
