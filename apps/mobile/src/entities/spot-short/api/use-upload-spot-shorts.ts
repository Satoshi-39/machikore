/**
 * スポットショート（動画）をアップロードするhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImage, STORAGE_BUCKETS, createSpotShort } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { SpotShortRow } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';

export interface SelectedVideo {
  uri: string;
  width?: number;
  height?: number;
  duration?: number; // 秒
  fileSize?: number;
}

interface UploadSpotShortsParams {
  spotId: string;
  userId: string;
  videos: SelectedVideo[];
  onProgress?: (current: number, total: number) => void;
}

interface UploadResult {
  uploaded: number;
  failed: number;
  shortRows: SpotShortRow[];
  spotId: string;
}

/**
 * スポットショート動画をSupabase Storageにアップロードし、spot_shortsテーブルに保存
 */
export function useUploadSpotShorts() {
  const queryClient = useQueryClient();

  return useMutation<UploadResult, Error, UploadSpotShortsParams>({
    mutationFn: async ({ spotId, userId, videos, onProgress }) => {
      log.debug(`[SpotShorts] 開始: spotId=${spotId}, videos=${videos.length}`);

      const uploadedShorts: SpotShortRow[] = [];
      let failed = 0;

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i]!;
        log.debug(`[SpotShorts] 動画${i}: URI=${video.uri}`);

        // 進捗を報告
        onProgress?.(i + 1, videos.length);

        // 拡張子を取得（デフォルトはmp4）
        const extension = video.uri.split('.').pop()?.toLowerCase() || 'mp4';
        const fileName = `${Date.now()}_${i}.${extension}`;
        const path = `${spotId}/${fileName}`;
        log.debug(`[SpotShorts] path=${path}`);

        // MIMEタイプを決定
        let contentType = 'video/mp4';
        if (extension === 'mov') {
          contentType = 'video/quicktime';
        } else if (extension === 'webm') {
          contentType = 'video/webm';
        }

        try {
          // Supabase Storageにアップロード
          const result = await uploadImage({
            uri: video.uri,
            bucket: STORAGE_BUCKETS.SPOT_SHORTS,
            path,
            contentType,
          });

          if (!result.success) {
            log.error('[SpotShorts] 動画アップロード失敗:', result.error);
            failed++;
            continue;
          }

          // spot_shortsテーブルに保存
          const shortRow = await createSpotShort({
            spotId,
            userId,
            videoUrl: result.data.url,
            thumbnailUrl: null, // サムネイルは後で生成可能
            durationSeconds: video.duration ?? null,
            width: video.width ?? null,
            height: video.height ?? null,
            fileSizeBytes: video.fileSize ?? null,
            orderIndex: i,
          });

          uploadedShorts.push(shortRow);
        } catch (error) {
          log.error('[SpotShorts] 動画処理エラー:', error);
          failed++;
        }
      }

      return {
        uploaded: uploadedShorts.length,
        failed,
        shortRows: uploadedShorts,
        spotId,
      };
    },
    onSuccess: (result) => {
      // ショートキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotShorts(result.spotId) });
    },
  });
}
