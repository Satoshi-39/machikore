/**
 * User Spots API 型定義
 */

import type { Database, Json } from '@/shared/types/database.types';
import type { ProseMirrorDoc, MapLabelBasicInfo } from '@/shared/types';

// MergeDeepで拡張されたDatabase型を使用
// article_contentがProseMirrorDoc型として正しく認識される
export type MasterSpotInsert = Database['public']['Tables']['master_spots']['Insert'];
export type MasterSpotRow = Database['public']['Tables']['master_spots']['Row'];
export type UserSpotInsert = Database['public']['Tables']['user_spots']['Insert'];
export type UserSpotRow = Database['public']['Tables']['user_spots']['Row'];

export interface CreateSpotInput {
  userId: string;
  mapId: string;
  machiId?: string | null;
  // prefecture_id, city_id, prefecture_name, city_name, machi_name は machi テーブルから JOIN で取得
  // master_spot情報
  name: string;
  latitude: number;
  longitude: number;
  googlePlaceId?: string | null;
  googleFormattedAddress?: string | null;
  googleShortAddress?: string | null;
  googleTypes?: string[] | null;
  googlePhoneNumber?: string | null;
  googleWebsiteUri?: string | null;
  googleRating?: number | null;
  googleUserRatingCount?: number | null;
  // user_spot情報
  description: string;
  articleContent?: ProseMirrorDoc | null;
  spotColor?: string | null;
  labelId?: string | null;
  // 現在地/ピン刺し登録用のスポット名（多言語対応JSONB形式で保存）
  spotName?: string | null;
}

export interface UpdateSpotInput {
  id: string;
  description?: string;
  article_content?: ProseMirrorDoc | null;
  order_index?: number;
  map_id?: string;
  spot_color?: string | null;
  label_id?: string | null;
  /** 現在地/ピン刺し登録用のスポット名（JSONB形式） */
  name?: Record<string, string> | null;
}

export interface UserSpotImage {
  id: string;
  cloud_path: string | null;
  order_index: number;
}

/**
 * 発見タブ用のスポット検索結果型
 */
export interface UserSpotSearchResult {
  id: string;
  user_id: string;
  map_id: string;
  master_spot_id: string | null;
  machi_id: string | null;
  description: string;
  tags: string[] | null;
  spot_color?: string | null;
  label_id?: string | null;
  map_label?: MapLabelBasicInfo | null;
  /** ピン刺し・現在地登録の場合のスポット名（master_spotがない場合に使用、JSONB型） */
  name?: Json | null;
  images_count: number;
  likes_count: number;
  comments_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  master_spot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    google_place_id: string | null;
    google_formatted_address: Json | null;
    google_short_address: Json | null;
    google_types: string[] | null;
  } | null;
  user: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  map: {
    id: string;
    name: string;
  } | null;
}

/**
 * マップ内スポット検索結果の型
 */
export interface MapSpotSearchResult {
  id: string;
  name: string;
  address: Json | null; // JSONB型（多言語対応）
  latitude: number;
  longitude: number;
}
