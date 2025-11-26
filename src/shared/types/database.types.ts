/**
 * Database Types
 *
 * Supabase型を基準に、SQLite用の型を自動生成
 */

import type { Database } from './supabase.generated';

// ===============================
// Type Utilities
// ===============================

/**
 * SQLite用に型を変換
 * - boolean → 0 | 1
 * - その他はそのまま
 */
type ToSQLiteType<T> =
  T extends string | null ? T :
  T extends number | null ? T :
  T extends boolean ? 0 | 1 :
  T extends boolean | null ? 0 | 1 | null :
  T;

/**
 * オブジェクト全体をSQLite型に変換
 */
type ToSQLite<T> = {
  [K in keyof T]: ToSQLiteType<T[K]>;
};

// ===============================
// Supabase Tables (as-is)
// ===============================

export type SupabaseTables = Database['public']['Tables'];

// Users
export type SupabaseUserRow = SupabaseTables['users']['Row'];
export type SupabaseUserInsert = SupabaseTables['users']['Insert'];
export type SupabaseUserUpdate = SupabaseTables['users']['Update'];

// NOTE: 以下は将来的にSupabaseから生成される型
// 現在は街コレ用のSupabaseプロジェクトを作成していないため、一時的にコメントアウト
// 新しいSupabaseプロジェクト作成後、これらの型を有効化する

// // Visits
// export type SupabaseVisitRow = SupabaseTables['visits']['Row'];
// export type SupabaseVisitInsert = SupabaseTables['visits']['Insert'];
// export type SupabaseVisitUpdate = SupabaseTables['visits']['Update'];

// // Maps
// export type SupabaseMapRow = SupabaseTables['maps']['Row'];
// export type SupabaseMapInsert = SupabaseTables['maps']['Insert'];
// export type SupabaseMapUpdate = SupabaseTables['maps']['Update'];

// // Spots
// export type SupabaseSpotRow = SupabaseTables['spots']['Row'];
// export type SupabaseSpotInsert = SupabaseTables['spots']['Insert'];
// export type SupabaseSpotUpdate = SupabaseTables['spots']['Update'];

// // Images
// export type SupabaseImageRow = SupabaseTables['images']['Row'];
// export type SupabaseImageInsert = SupabaseTables['images']['Insert'];
// export type SupabaseImageUpdate = SupabaseTables['images']['Update'];

// // Follows
// export type SupabaseFollowRow = SupabaseTables['follows']['Row'];
// export type SupabaseFollowInsert = SupabaseTables['follows']['Insert'];
// export type SupabaseFollowUpdate = SupabaseTables['follows']['Update'];

// // Likes
// export type SupabaseLikeRow = SupabaseTables['likes']['Row'];
// export type SupabaseLikeInsert = SupabaseTables['likes']['Insert'];
// export type SupabaseLikeUpdate = SupabaseTables['likes']['Update'];

// // Comments
// export type SupabaseCommentRow = SupabaseTables['comments']['Row'];
// export type SupabaseCommentInsert = SupabaseTables['comments']['Insert'];
// export type SupabaseCommentUpdate = SupabaseTables['comments']['Update'];

// // Bookmarks
// export type SupabaseBookmarkRow = SupabaseTables['bookmarks']['Row'];
// export type SupabaseBookmarkInsert = SupabaseTables['bookmarks']['Insert'];
// export type SupabaseBookmarkUpdate = SupabaseTables['bookmarks']['Update'];

// ===============================
// SQLite Tables (converted)
// ===============================

// Users
export type UserRow = ToSQLite<SupabaseUserRow> & {
  synced_at: string | null;
  is_synced: 0 | 1;
};
export type UserInsert = ToSQLite<SupabaseUserInsert> & {
  synced_at?: string | null;
  is_synced?: 0 | 1;
};
export type UserUpdate = ToSQLite<SupabaseUserUpdate> & {
  synced_at?: string | null;
  is_synced?: 0 | 1;
};

// NOTE: 以下は一時的にローカル定義。Supabaseプロジェクト作成後、上記のSupabase型から生成する

// Maps
export interface MapRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string | null; // JSON string array
  is_public: 0 | 1;
  is_default: 0 | 1;
  is_official: 0 | 1;
  thumbnail_url: string | null;
  spots_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type MapInsert = Partial<MapRow> & Pick<MapRow, 'id' | 'user_id' | 'name' | 'created_at' | 'updated_at'>;
export type MapUpdate = Partial<Omit<MapRow, 'id' | 'created_at'>>;

// Master Spots (マスタースポット - 正規化された場所データ)
export interface MasterSpotRow {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null; // Google Place ID
  google_formatted_address: string | null; // フォーマット済み住所
  google_types: string | null; // JSON string array: ["restaurant", "food"]
  google_phone_number: string | null; // 国際電話番号
  google_website_uri: string | null; // ウェブサイトURL
  google_rating: number | null; // 評価（1-5）
  google_user_rating_count: number | null; // レビュー数
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type MasterSpotInsert = Partial<MasterSpotRow> & Pick<MasterSpotRow, 'id' | 'name' | 'latitude' | 'longitude' | 'created_at' | 'updated_at'>;
export type MasterSpotUpdate = Partial<Omit<MasterSpotRow, 'id' | 'created_at'>>;

// マスタースポットの表示用（sync関連フィールドを除外）
export type MasterSpotDisplay = Omit<MasterSpotRow, 'created_at' | 'updated_at' | 'synced_at' | 'is_synced'>;

// Spots (ユーザースポット - master_spotsへの参照 + ユーザーカスタマイズ)
export interface SpotRow {
  id: string;
  user_id: string;
  map_id: string;
  master_spot_id: string; // master_spotsテーブルへの参照
  machi_id: string;
  custom_name: string | null; // ユーザー独自の名前（任意）
  description: string | null; // 旧memoカラム
  tags: string | null; // JSON string array: ["tag1", "tag2"]
  images_count: number;
  likes_count: number;
  comments_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type SpotInsert = Partial<SpotRow> & Pick<SpotRow, 'id' | 'user_id' | 'map_id' | 'master_spot_id' | 'machi_id' | 'created_at' | 'updated_at'>;
export type SpotUpdate = Partial<Omit<SpotRow, 'id' | 'created_at'>>;

// SpotWithMasterSpot (JOINクエリ用 - spotsとmaster_spotsを結合したデータ)
export interface SpotWithMasterSpot extends SpotRow {
  // master_spotsからの追加フィールド
  name: string; // master_spots.name (基本名称)
  latitude: number; // master_spots.latitude
  longitude: number; // master_spots.longitude
  address: string | null; // master_spots.google_formatted_address
  google_place_id: string | null; // master_spots.google_place_id
  google_types: string | null; // master_spots.google_types
  google_phone_number: string | null; // master_spots.google_phone_number
  google_website_uri: string | null; // master_spots.google_website_uri
  google_rating: number | null; // master_spots.google_rating
  google_user_rating_count: number | null; // master_spots.google_user_rating_count
}

// Visits (街訪問記録)
export interface VisitRow {
  id: string;
  user_id: string;
  machi_id: string;
  visit_count: number;
  visited_at: string;
  memo: string | null;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type VisitInsert = Partial<VisitRow> & Pick<VisitRow, 'id' | 'user_id' | 'machi_id' | 'visited_at' | 'created_at' | 'updated_at'>;
export type VisitUpdate = Partial<Omit<VisitRow, 'id' | 'created_at'>>;

// Images (スポット画像)
export interface ImageRow {
  id: string;
  spot_id: string;
  local_path: string | null;
  cloud_path: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type ImageInsert = Partial<ImageRow> & Pick<ImageRow, 'id' | 'spot_id' | 'created_at' | 'updated_at'>;
export type ImageUpdate = Partial<Omit<ImageRow, 'id' | 'created_at'>>;

// Follows (フォロー関係)
export interface FollowRow {
  id: string;
  follower_id: string; // フォローする人
  followee_id: string; // フォローされる人
  created_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type FollowInsert = Partial<FollowRow> & Pick<FollowRow, 'id' | 'follower_id' | 'followee_id' | 'created_at'>;
export type FollowUpdate = Partial<Omit<FollowRow, 'id' | 'created_at'>>;

// Likes (マップ・スポットへのいいね)
export interface LikeRow {
  id: string;
  user_id: string;
  map_id: string | null;
  spot_id: string | null;
  created_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type LikeInsert = Partial<LikeRow> & Pick<LikeRow, 'id' | 'user_id' | 'created_at'>;
export type LikeUpdate = Partial<Omit<LikeRow, 'id' | 'created_at'>>;

// Comments (マップ・スポットへのコメント)
export interface CommentRow {
  id: string;
  user_id: string;
  map_id: string | null;
  spot_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type CommentInsert = Partial<CommentRow> & Pick<CommentRow, 'id' | 'user_id' | 'content' | 'created_at' | 'updated_at'>;
export type CommentUpdate = Partial<Omit<CommentRow, 'id' | 'created_at'>>;

// Schedules (予定)
export interface ScheduleRow {
  id: string;
  user_id: string;
  machi_id: string;
  scheduled_at: string;
  title: string;
  memo: string | null;
  is_completed: 0 | 1;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type ScheduleInsert = Partial<ScheduleRow> & Pick<ScheduleRow, 'id' | 'user_id' | 'machi_id' | 'scheduled_at' | 'title' | 'created_at' | 'updated_at'>;
export type ScheduleUpdate = Partial<Omit<ScheduleRow, 'id' | 'created_at'>>;

// Bookmarks (マップ・スポットのブックマーク)
export interface BookmarkRow {
  id: string;
  user_id: string;
  map_id: string | null;
  spot_id: string | null;
  created_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
export type BookmarkInsert = Partial<BookmarkRow> & Pick<BookmarkRow, 'id' | 'user_id' | 'created_at'>;
export type BookmarkUpdate = Partial<Omit<BookmarkRow, 'id' | 'created_at'>>;

// ===============================
// Local-only Tables
// ===============================

/**
 * Region (地方マスター)
 */
export interface RegionRow {
  id: string;              // "hokkaido", "tohoku", "kanto"
  name: string;            // "北海道", "東北", "関東"
  name_kana: string;       // "ほっかいどう", "とうほく"
  name_translations: string | null; // JSON: {"en": "Hokkaido", "zh": "北海道"}
  country_code: string;    // "jp"
  display_order: number;   // 1, 2, 3...
  created_at: string;
  updated_at: string;
}

/**
 * Prefecture (都道府県マスター)
 */
export interface PrefectureRow {
  id: string;              // "tokyo", "kanagawa"
  name: string;            // "東京都", "神奈川県"
  name_kana: string;       // "とうきょうと"
  name_translations: string | null; // JSON: {"en": "Tokyo", "zh": "东京"}
  region_id: string | null; // "kanto", "kinki" (外部キー → regions.id) - Optional for countries without region concept
  latitude: number | null; // 中心座標の緯度
  longitude: number | null; // 中心座標の経度
  country_code: string;    // "jp"
  created_at: string;
  updated_at: string;
}

/**
 * City (市区町村マスター)
 */
export interface CityRow {
  id: string;              // "shibuya", "minato"
  prefecture_id: string;   // "tokyo"
  name: string;            // "渋谷区", "港区"
  name_kana: string;       // "しぶやく"
  name_translations: string | null; // JSON: {"en": "Shibuya", "zh": "涩谷"}
  type: string;            // "区", "市", "町", "村"
  latitude: number | null; // 中心座標の緯度
  longitude: number | null; // 中心座標の経度
  country_code: string;    // "jp"
  created_at: string;
  updated_at: string;
}

/**
 * Machi (ローカルマスターデータ)
 * Supabaseには存在しない、アプリ専用のマスターデータ
 */
export interface MachiRow {
  id: string;
  name: string;
  name_kana: string;
  name_translations: string | null; // JSON: {"en": "Shibuya", "zh": "涩谷"}
  latitude: number;
  longitude: number;
  lines: string | null;      // JSON array: [{"ja": "JR山手線", "en": "JR Yamanote Line"}, ...]
  prefecture_id: string;     // "tokyo", "kanagawa"
  city_id: string | null;    // "shibuya", "minato"
  country_code: string;      // "jp"
  prefecture_name: string;   // "東京都" (denormalized for performance)
  prefecture_name_translations: string | null; // JSON: {"en": "Tokyo", "zh": "东京"}
  city_name: string | null;  // "渋谷区" (denormalized for performance)
  city_name_translations: string | null; // JSON: {"en": "Shibuya", "zh": "涩谷"}
  created_at: string;
  updated_at: string;
}

/**
 * Sync Queue (ローカル同期キュー)
 * Note: SyncQueueRow, SyncOperationType は sync.types.ts に定義されています
 */

/**
 * App Settings (ローカル設定)
 */
export interface AppSettingRow {
  key: string;
  value: string;
  updated_at: string;
}

// ===============================
// Helper Functions
// ===============================

/**
 * SQLite boolean (0 | 1) → TypeScript boolean
 */
export function sqliteBooleanToBoolean(value: 0 | 1 | null): boolean | null {
  if (value === null) return null;
  return value === 1;
}

/**
 * TypeScript boolean → SQLite boolean (0 | 1)
 */
export function booleanToSQLiteBoolean(value: boolean | null): 0 | 1 | null {
  if (value === null) return null;
  return value ? 1 : 0;
}

/**
 * Convert Supabase Row to SQLite Row
 * Supabase: boolean | null → SQLite: 0 | 1 | null
 * NOTE: 新しいSupabaseプロジェクト作成後、必要に応じて変換関数を追加
 */

/**
 * Supabase VisitRow → SQLite VisitRow
 * TODO: 現在は変換不要。Supabaseプロジェクト作成後、型変換ロジックを実装
 */
export function convertSupabaseVisitToSQLite(visit: any): VisitRow {
  return visit as VisitRow;
}

// ===============================
// Re-export common types
// ===============================

export type { Database } from './supabase.generated';
