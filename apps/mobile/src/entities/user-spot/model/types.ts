/**
 * Spot エンティティ型定義
 */

import type { SpotRow, ImageRow } from '@/shared/types/database.types';
import type { ProseMirrorDoc } from '@/shared/types';
import type { SpotColor } from '@/shared/config';

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
  description: string; // スポットの一言説明（必須）
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
  description?: string; // スポットの一言説明（NOT NULL制約があるためnullは不可）
  articleContent?: ProseMirrorDoc | null; // 記事（ProseMirror JSON形式）
  orderIndex?: number;
  mapId?: string;
  spotColor?: SpotColor;
  labelId?: string | null;
  /** 現在地/ピン刺し登録用のスポット名（入力時は文字列、保存時にJSONB形式に変換） */
  spotName?: string;
  /** スポットの公開/非公開設定 */
  isPublic?: boolean;
  /** サムネイル画像ID（nullで自動選択に戻す） */
  thumbnailImageId?: string | null;
}

/**
 * 画像アップロードパラメータ
 */
export interface UploadSpotImagesParams {
  spotId: string;
  imageUris: string[];
}
