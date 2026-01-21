/**
 * spot_shorts 型定義
 */

import type { Database } from '@machikore/database';

// Supabase生成型
export type SpotShortRow = Database['public']['Tables']['spot_shorts']['Row'];
export type SpotShortInsert = Database['public']['Tables']['spot_shorts']['Insert'];
export type SpotShortUpdate = Database['public']['Tables']['spot_shorts']['Update'];

// 作成用パラメータ
export interface CreateSpotShortParams {
  spotId: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  width?: number | null;
  height?: number | null;
  fileSizeBytes?: number | null;
  orderIndex?: number;
}

// Insert用に変換
export function toSpotShortInsert(params: CreateSpotShortParams): SpotShortInsert {
  return {
    spot_id: params.spotId,
    user_id: params.userId,
    video_url: params.videoUrl,
    thumbnail_url: params.thumbnailUrl ?? null,
    duration_seconds: params.durationSeconds ?? null,
    width: params.width ?? null,
    height: params.height ?? null,
    file_size_bytes: params.fileSizeBytes ?? null,
    order_index: params.orderIndex ?? 0,
  };
}
