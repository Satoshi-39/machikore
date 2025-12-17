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
 * スポット作成パラメータ（新スキーマ対応）
 * tagsは中間テーブル(spot_tags)で管理するため、useUpdateSpotTagsを使用
 */
export interface CreateSpotParams {
  userId: string;
  mapId: string;
  machiId: string;
  name: string;
  address?: string | null;
  latitude: number;
  longitude: number;
  description?: string | null; // 旧memo
  customName?: string | null; // ユーザー独自の名前
  images?: string[]; // 画像URI配列
  // Google Placesデータ（検索から選択した場合）
  googlePlaceId?: string | null;
  googleTypes?: string[] | null;
  googlePhoneNumber?: string | null;
  googleWebsiteUri?: string | null;
  googleRating?: number | null;
  googleUserRatingCount?: number | null;
}

/**
 * スポット更新パラメータ（新スキーマ対応）
 * ユーザーカスタマイズ可能なフィールドのみ
 * tagsは中間テーブル(spot_tags)で管理するため、useUpdateSpotTagsを使用
 */
export interface UpdateSpotParams {
  spotId: string;
  customName?: string; // NOT NULL制約があるためnullは不可
  description?: string | null; // ひとこと
  articleContent?: string | null; // 記事
  orderIndex?: number;
  mapId?: string;
}

/**
 * 画像アップロードパラメータ
 */
export interface UploadSpotImagesParams {
  spotId: string;
  imageUris: string[];
}
