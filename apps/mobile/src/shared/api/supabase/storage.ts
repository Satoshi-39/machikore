/**
 * Supabase Storage関連の関数
 */

import { supabase } from './client';
import type { Result } from '@/shared/types';
import { log } from '@/shared/config/logger';

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
 * Edge Function経由でアップロード（サーバーサイドで処理）
 */
export async function uploadImage({
  uri,
  bucket,
  path,
  contentType = 'image/jpeg',
}: UploadImageParams): Promise<Result<{ url: string; path: string }>> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log.debug(`[Storage] 開始 (試行${attempt}/${maxRetries}):`, { uri, bucket, path });

      // セッション取得
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        return { success: false, error: new Error('認証されていません') };
      }

      // Edge Function URL
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/upload-image`;

      // FormDataを作成
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: contentType,
        name: path.split('/').pop() || 'image.jpg',
      } as any);
      formData.append('bucket', bucket);
      formData.append('path', path);

      // Edge Functionにアップロード
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      log.debug('[Storage] Edge Function結果:', response.status);

      const result = await response.json();

      if (!response.ok || !result.success) {
        log.error('[Storage] アップロード失敗:', result.error);
        lastError = new Error(result.error || 'アップロード失敗');
        continue; // リトライ
      }

      log.info('[Storage] 成功:', result.url);

      return {
        success: true,
        data: {
          url: result.url,
          path: result.path,
        },
      };
    } catch (error) {
      log.error(`[Storage] 例外発生 (試行${attempt}):`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // リトライ前に少し待機
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  return {
    success: false,
    error: lastError || new Error('アップロードに失敗しました'),
  };
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
  SPOT_SHORTS: 'spot-shorts',
  MAP_THUMBNAILS: 'map-thumbnails',
  COLLECTION_THUMBNAILS: 'collection-thumbnails',
} as const;
