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
  comments_count: number;
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
 * SpotWithDetails - スポット + マスタースポット + ユーザー情報 + いいね状態
 *
 * spots JOIN master_spots JOIN users の結果
 * is_liked は現在のユーザーがいいねしているかを示す
 */
/**
 * JOINで取得するマップ基本情報
 */
export interface MapBasicInfo {
  id: string;
  name: string;
}

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
  /** 所属するマップの情報 */
  map?: MapBasicInfo | null;
  /** 現在のユーザーがこのスポットにいいねしているか */
  is_liked?: boolean;
  /** マップ記事用の紹介文 */
  article_content?: string | null;
}

// ===============================
// マップ記事用複合型
// ===============================

/**
 * スポット + 画像（記事表示用）
 */
export interface SpotWithImages extends SpotWithDetails {
  images: {
    id: string;
    cloud_path: string | null;
    order_index: number;
  }[];
}

/**
 * マップ記事データ（マップ + スポット一覧 + 画像）
 */
export interface MapArticleData {
  map: MapWithUser;
  spots: SpotWithImages[];
}
