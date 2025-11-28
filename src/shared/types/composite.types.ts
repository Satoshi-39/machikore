/**
 * 複合型（JOINクエリ結果）
 *
 * 複数のテーブルを結合した結果の型定義
 * FSD: shared/types に配置（複数entityにまたがるため）
 */

// ===============================
// ユーザー情報（共通）
// ===============================

/**
 * JOINで取得するユーザー基本情報
 */
export interface UserBasicInfo {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

// ===============================
// マップ複合型
// ===============================

/**
 * MapWithUser - マップ + ユーザー情報
 *
 * maps JOIN users の結果
 */
export interface MapWithUser {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  is_public: boolean;
  is_default: boolean;
  is_official: boolean;
  thumbnail_url: string | null;
  spots_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user: UserBasicInfo | null;
}

// ===============================
// マスタースポット情報（共通）
// ===============================

/**
 * JOINで取得するマスタースポット基本情報
 */
export interface MasterSpotBasicInfo {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: string | null;
  google_types: string[] | null;
}

// ===============================
// スポット複合型
// ===============================

/**
 * SpotWithDetails - スポット + マスタースポット + ユーザー情報
 *
 * spots JOIN master_spots JOIN users の結果
 */
export interface SpotWithDetails {
  id: string;
  user_id: string;
  map_id: string;
  master_spot_id: string;
  machi_id: string;
  custom_name: string | null;
  description: string | null;
  tags: string[] | null;
  images_count: number;
  likes_count: number;
  comments_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  master_spot: MasterSpotBasicInfo | null;
  user: UserBasicInfo | null;
}
