/**
 * User Spots API 型定義
 */

import type { Database, Json } from '@/shared/types/database.types';
import type { ProseMirrorDoc, MapLabelBasicInfo, TagBasicInfo } from '@/shared/types';

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
    name: Json | null; // JSONB型（多言語対応: {"ja": "...", "en": "..."}）
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
  /** スポットに紐づくタグ */
  tags?: TagBasicInfo[];
  /** スポットの記事コンテンツ（ProseMirror JSON形式） */
  article_content?: ProseMirrorDoc | null;
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

// ===============================
// RPC用型定義
// ===============================

/**
 * search_public_spots RPCのレスポンス型
 * Supabaseが返すJSONB型のフィールドを具体的な型で定義
 */
export interface SearchPublicSpotsRpcRow {
  id: string;
  user_id: string;
  map_id: string;
  master_spot_id: string | null;
  machi_id: string | null;
  description: string;
  spot_color: string | null;
  label_id: string | null;
  label_name: string | null;
  label_color: string | null;
  /** ピン刺し・現在地登録の場合のスポット名（JSONB） */
  name: Json | null;
  images_count: number;
  likes_count: number;
  comments_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
  google_formatted_address: Json | null;
  google_short_address: Json | null;
  // master_spot fields
  master_spot_name: Json | null;
  master_spot_latitude: number | null;
  master_spot_longitude: number | null;
  master_spot_google_place_id: string | null;
  master_spot_google_formatted_address: Json | null;
  master_spot_google_short_address: Json | null;
  master_spot_google_types: string[] | null;
  // user fields
  user_username: string | null;
  user_display_name: string | null;
  user_avatar_url: string | null;
  // map fields
  map_name: string | null;
  // tags (JSONB → 具体的な型で定義)
  tags: TagBasicInfo[] | null;
  // article content (JSONB → ProseMirror形式)
  article_content: ProseMirrorDoc | null;
}

/**
 * search_public_spots RPCレスポンスをUserSpotSearchResultに変換するヘルパー
 */
export function rpcSpotResponseToUserSpotSearchResult(row: SearchPublicSpotsRpcRow): UserSpotSearchResult {
  return {
    id: row.id,
    user_id: row.user_id,
    map_id: row.map_id,
    master_spot_id: row.master_spot_id,
    machi_id: row.machi_id,
    description: row.description,
    spot_color: row.spot_color,
    label_id: row.label_id,
    map_label: row.label_name ? {
      id: row.label_id!,
      name: row.label_name,
      color: row.label_color!,
    } : null,
    name: row.name,
    images_count: row.images_count,
    likes_count: row.likes_count,
    comments_count: row.comments_count,
    order_index: row.order_index,
    created_at: row.created_at,
    updated_at: row.updated_at,
    master_spot: row.master_spot_id ? {
      id: row.master_spot_id,
      name: row.master_spot_name,
      latitude: row.master_spot_latitude!,
      longitude: row.master_spot_longitude!,
      google_place_id: row.master_spot_google_place_id,
      google_formatted_address: row.master_spot_google_formatted_address,
      google_short_address: row.master_spot_google_short_address,
      google_types: row.master_spot_google_types,
    } : null,
    user: row.user_username ? {
      id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      avatar_url: row.user_avatar_url,
    } : null,
    map: row.map_name ? { id: row.map_id, name: row.map_name } : null,
    tags: row.tags && row.tags.length > 0 ? row.tags : undefined,
    article_content: row.article_content,
  };
}
