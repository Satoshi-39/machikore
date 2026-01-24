/**
 * Spot ビジネスロジック
 */

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { SpotRow } from '@/shared/types/database.types';
import type { CreateSpotParams } from './types';

// ===============================
// スポット作成
// ===============================

/**
 * 新規スポットデータを作成（新スキーマ対応）
 * spotとmasterSpotの両方のデータを返す
 */
export function createSpotData(params: CreateSpotParams): {
  spot: SpotRow;
  masterSpot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    google_place_id: string | null;
    google_formatted_address: string | null;
    google_types: string | null;
    google_phone_number: string | null;
    google_website_uri: string | null;
    google_rating: number | null;
    google_user_rating_count: number | null;
  };
} {
  const now = new Date().toISOString();
  const spotId = uuidv4();
  const masterSpotId = uuidv4();

  return {
    spot: {
      id: spotId,
      map_id: params.mapId,
      user_id: params.userId,
      machi_id: params.machiId,
      master_spot_id: masterSpotId, // 後で insertOrGetMasterSpot で置き換えられる
      name: null,
      description: params.description,
      article_content: null,
      // tagsは中間テーブル(spot_tags)で管理するため、ここでは設定しない
      images_count: 0,
      likes_count: 0,
      bookmarks_count: 0,
      comments_count: 0,
      order_index: 0,
      spot_color: null,
      label_id: null,
      latitude: params.latitude,
      longitude: params.longitude,
      prefecture_id: null, // 後でバックフィルまたはトリガーで設定される
      city_id: null, // 後でバックフィルまたはトリガーで設定される
      google_formatted_address: params.address || null,
      google_short_address: null,
      language: null,
      is_public: true,
      thumbnail_image_id: null,
      created_at: now,
      updated_at: now,
    },
    masterSpot: {
      id: masterSpotId,
      name: params.name,
      latitude: params.latitude,
      longitude: params.longitude,
      google_place_id: params.googlePlaceId || null,
      google_formatted_address: params.address || null,
      google_types: params.googleTypes ? JSON.stringify(params.googleTypes) : null,
      google_phone_number: params.googlePhoneNumber || null,
      google_website_uri: params.googleWebsiteUri || null,
      google_rating: params.googleRating || null,
      google_user_rating_count: params.googleUserRatingCount || null,
    },
  };
}

// ===============================
// バリデーション
// ===============================

/**
 * スポット作成パラメータのバリデーション
 */
export function validateCreateSpotParams(
  params: CreateSpotParams
): { valid: boolean; error?: string } {
  if (!params.userId || params.userId.trim() === '') {
    return { valid: false, error: 'ユーザーIDが必要です' };
  }

  if (!params.name || params.name.trim() === '') {
    return { valid: false, error: 'スポット名が必要です' };
  }

  if (params.name.length > 100) {
    return { valid: false, error: 'スポット名は100文字以内にしてください' };
  }

  if (params.description && params.description.length > 2000) {
    return { valid: false, error: '説明は2000文字以内にしてください' };
  }

  if (params.images && params.images.length > 10) {
    return { valid: false, error: '画像は10枚まで添付できます' };
  }

  return { valid: true };
}

// ===============================
// ソート・フィルタ
// ===============================

/**
 * スポットを日付でソート（新しい順）
 */
export function sortSpotsByDate(spots: SpotRow[]): SpotRow[] {
  return [...spots].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * スポットを並び順でソート
 */
export function sortSpotsByOrder(spots: SpotRow[]): SpotRow[] {
  return [...spots].sort((a, b) => a.order_index - b.order_index);
}
