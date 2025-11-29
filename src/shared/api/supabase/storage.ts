/**
 * Supabase Storage関連の関数
 */

import { supabase } from './client';
import type { Result } from '@/shared/types';

// ===============================
// 画像アップロード
// ===============================

export interface UploadImageParams {
  uri: string;
  bucket: string;
  path: string;
  contentType?: string;
}

/**
 * 画像をSupabase Storageにアップロード
 */
export async function uploadImage({
  uri,
  bucket,
  path,
  contentType = 'image/jpeg',
}: UploadImageParams): Promise<Result<{ url: string; path: string }>> {
  try {
    // URIからBlob作成（React Nativeの場合）
    const response = await fetch(uri);
    const blob = await response.blob();

    // アップロード
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        contentType,
        upsert: false,
      });

    if (error) {
      return { success: false, error };
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      data: {
        url: publicUrl,
        path: data.path,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 画像を削除
 */
export async function deleteImage(
  bucket: string,
  path: string
): Promise<Result<void>> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { success: false, error };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 複数画像を削除
 */
export async function deleteImages(
  bucket: string,
  paths: string[]
): Promise<Result<void>> {
  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      return { success: false, error };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 画像の公開URLを取得
 */
export function getPublicUrl(bucket: string, path: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

// ===============================
// ストレージバケット定数
// ===============================

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  SPOT_IMAGES: 'spot-images',
  MAP_THUMBNAILS: 'map-thumbnails',
} as const;
