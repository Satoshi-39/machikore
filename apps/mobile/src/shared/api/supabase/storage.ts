/**
 * Supabase Storage関連の関数
 */

import pLimit from 'p-limit';
import { supabase } from './client';
import type { Result } from '@/shared/types';
import { log } from '@/shared/config/logger';
import { convertToJpeg } from '@/shared/lib/image/convert';

// iOSは1ホストあたり最大6同時接続。各アップロードで認証+fetch=2接続使うため2に制限
const uploadLimiter = pLimit(2);

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
 * p-limitで同時接続数を制限し、Network request failedを防止
 */
export function uploadImage(params: UploadImageParams): Promise<Result<{ url: string; path: string }>> {
  return uploadLimiter(() => uploadImageInternal(params));
}

async function uploadImageInternal({
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

/**
 * Supabase Storage URLから originals/ パスのURLを構築
 *
 * 例:
 * .../object/public/map-thumbnails/userId/file.jpg
 * → .../object/public/map-thumbnails/originals/userId/file.jpg
 *
 * Supabase Storage URLでない場合は null を返す
 */
export function getOriginalImageUrl(url: string): string | null {
  const pattern = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;
  const match = url.match(pattern);
  if (!match) return null;

  const [, bucket, path] = match;
  return url.replace(
    `/storage/v1/object/public/${bucket}/${path}`,
    `/storage/v1/object/public/${bucket}/originals/${path}`,
  );
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

// ===============================
// バケット別リサイズ設定
// ===============================

type BucketName = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

interface ResizeConfig {
  /** リサイズ後の最大幅/高さ（px） */
  maxDimension: number;
  /** JPEG圧縮率（0-1） */
  compress: number;
}

const BUCKET_RESIZE_CONFIG: Record<string, ResizeConfig> = {
  [STORAGE_BUCKETS.SPOT_IMAGES]: { maxDimension: 1200, compress: 0.8 },
  [STORAGE_BUCKETS.AVATARS]: { maxDimension: 384, compress: 0.8 },
  [STORAGE_BUCKETS.MAP_THUMBNAILS]: { maxDimension: 800, compress: 0.75 },
  [STORAGE_BUCKETS.COLLECTION_THUMBNAILS]: { maxDimension: 600, compress: 0.8 },
};

// ===============================
// リサイズ付きアップロード
// ===============================

export interface ResizeAndUploadImageParams {
  uri: string;
  bucket: BucketName;
  path: string;
}

/**
 * 画像をバケットに応じたサイズにリサイズしてアップロード
 *
 * 1. convertToJpeg() で表示用サイズにリサイズ・JPEG変換
 * 2. リサイズ済み画像をメインパスにアップロード（await）
 * 3. 元画像を originals/{path} にバックアップ（fire-and-forget）
 */
export async function resizeAndUploadImage({
  uri,
  bucket,
  path,
}: ResizeAndUploadImageParams): Promise<Result<{ url: string; path: string }>> {
  const config = BUCKET_RESIZE_CONFIG[bucket];
  if (!config) {
    // 設定がないバケット（spot-shorts等）はそのままアップロード
    return uploadImage({ uri, bucket, path });
  }

  try {
    // リサイズ・JPEG変換
    const resized = await convertToJpeg(uri, {
      maxDimension: config.maxDimension,
      compress: config.compress,
    });

    log.debug('[Storage] リサイズ完了:', {
      bucket,
      maxDimension: config.maxDimension,
      resultSize: `${resized.width}x${resized.height}`,
    });

    // リサイズ済み画像をメインパスにアップロード
    const result = await uploadImage({
      uri: resized.uri,
      bucket,
      path,
      contentType: 'image/jpeg',
    });

    // 元画像をバックアップ（fire-and-forget、p-limitで同時接続数を制限）
    const originalPath = `originals/${path}`;
    uploadImage({
      uri,
      bucket,
      path: originalPath,
    }).catch((error) => {
      log.warn('[Storage] 元画像バックアップ失敗（表示に影響なし）:', error);
    });

    return result;
  } catch (error) {
    log.error('[Storage] リサイズ処理エラー、元画像でアップロードを試行:', error);
    // リサイズ失敗時は元画像をそのままアップロード（フォールバック）
    return uploadImage({ uri, bucket, path });
  }
}
