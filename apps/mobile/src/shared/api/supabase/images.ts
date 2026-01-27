/**
 * Supabase Images API
 * スポット画像の保存・取得
 */

import { supabase } from './client';
import { deleteImage, STORAGE_BUCKETS } from './storage';
import type { ImageRow, ImageInsert } from '@/shared/types';
import { log } from '@/shared/config/logger';

/**
 * Supabase Storage URLからパスを抽出
 * 例: https://xxx.supabase.co/storage/v1/object/public/spot-images/spotId/filename.jpg
 *     → spotId/filename.jpg
 */
function extractPathFromUrl(url: string, bucket: string): string | null {
  try {
    // パターン: /storage/v1/object/public/{bucket}/{path}
    const pattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`);
    const match = url.match(pattern);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * スポット画像をimagesテーブルに保存
 */
export async function insertSpotImage(image: ImageInsert): Promise<ImageRow> {
  const { data, error } = await supabase
    .from('images')
    .insert(image)
    .select()
    .single();

  if (error) {
    log.error('[Images] Error:', error);
    throw error;
  }

  return data;
}

/**
 * 複数のスポット画像をimagesテーブルに保存
 */
export async function insertSpotImages(images: ImageInsert[]): Promise<ImageRow[]> {
  const { data, error } = await supabase
    .from('images')
    .insert(images)
    .select();

  if (error) {
    log.error('[Images] Error:', error);
    throw error;
  }

  return data || [];
}

/**
 * スポットIDで画像一覧を取得
 */
export async function getSpotImages(spotId: string): Promise<ImageRow[]> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('user_spot_id', spotId)
    .order('order_index', { ascending: true });

  if (error) {
    log.error('[Images] Error:', error);
    throw error;
  }

  return data || [];
}

/**
 * 画像を削除（メタデータとS3の両方）
 */
export async function deleteSpotImage(imageId: string): Promise<void> {
  // 1. まずメタデータからcloud_pathを取得
  const { data: image, error: fetchError } = await supabase
    .from('images')
    .select('cloud_path')
    .eq('id', imageId)
    .single();

  if (fetchError) {
    log.error('[Images] 画像情報取得エラー:', fetchError);
    throw fetchError;
  }

  // 2. S3から実ファイルを削除
  if (image?.cloud_path) {
    const path = extractPathFromUrl(image.cloud_path, STORAGE_BUCKETS.SPOT_IMAGES);
    if (path) {
      const deleteResult = await deleteImage(STORAGE_BUCKETS.SPOT_IMAGES, path);
      if (!deleteResult.success) {
        log.warn('[Images] S3削除に失敗しましたが、メタデータ削除は続行します:', deleteResult.error);
        // S3削除が失敗してもメタデータ削除は続行（孤立メタデータを防ぐ）
      } else {
        log.debug('[Images] S3から削除成功:', path);
      }
    } else {
      log.warn('[Images] URLからパスを抽出できませんでした:', image.cloud_path);
    }
  }

  // 3. メタデータを削除
  const { error: deleteError } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId);

  if (deleteError) {
    log.error('[Images] メタデータ削除エラー:', deleteError);
    throw deleteError;
  }

  log.debug('[Images] 画像削除完了:', imageId);
}
