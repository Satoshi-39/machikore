/**
 * Spot エンティティ型定義
 */

import type { SpotRow, ImageRow } from '@/shared/types/database.types';

// ===============================
// Domain Types
// ===============================

/**
 * 画像付きスポット
 */
export interface SpotWithImages extends SpotRow {
  images: ImageRow[];
}

/**
 * スポット作成パラメータ
 */
export interface CreateSpotParams {
  userId: string;
  mapId: string;
  machiId: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  memo?: string;
  images?: string[]; // 画像URI配列
}

/**
 * スポット更新パラメータ
 */
export interface UpdateSpotParams {
  spotId: string;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  memo?: string;
}

/**
 * 画像アップロードパラメータ
 */
export interface UploadSpotImagesParams {
  spotId: string;
  imageUris: string[];
}
