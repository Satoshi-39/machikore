/**
 * スポット画像をアップロードするhook（Supabase版）
 */

import { useMutation } from '@tanstack/react-query';
import { uploadImage, STORAGE_BUCKETS, insertSpotImage } from '@/shared/api/supabase';
import type { SelectedImage } from '@/features/pick-images';
import type { Database } from '@/shared/types/supabase.generated';

type ImageRow = Database['public']['Tables']['images']['Row'];

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
 * スポット画像をSupabase Storageにアップロードし、imagesテーブルに保存
 */
export function useUploadSpotImages() {
  return useMutation<UploadResult, Error, UploadSpotImagesParams>({
    mutationFn: async ({ spotId, images }) => {
      const uploadedImages: ImageRow[] = [];
      let failed = 0;

      for (let i = 0; i < images.length; i++) {
        const image = images[i]!;
        const extension = image.uri.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${i}.${extension}`;
        const path = `${spotId}/${fileName}`;

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

          // Supabaseのimagesテーブルに保存
          const imageRow = await insertSpotImage({
            spot_id: spotId,
            cloud_path: result.data.url,
            local_path: image.uri,
            width: image.width,
            height: image.height,
            file_size: image.fileSize ?? null,
            order_index: i,
          });

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
