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
type ToSQLiteType<T> = T extends boolean
  ? 0 | 1
  : T extends boolean | null
    ? 0 | 1 | null
    : T;

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

// Visits
export type SupabaseVisitRow = SupabaseTables['visits']['Row'];
export type SupabaseVisitInsert = SupabaseTables['visits']['Insert'];
export type SupabaseVisitUpdate = SupabaseTables['visits']['Update'];

// Posts
export type SupabasePostRow = SupabaseTables['posts']['Row'];
export type SupabasePostInsert = SupabaseTables['posts']['Insert'];
export type SupabasePostUpdate = SupabaseTables['posts']['Update'];

// Images
export type SupabaseImageRow = SupabaseTables['images']['Row'];
export type SupabaseImageInsert = SupabaseTables['images']['Insert'];
export type SupabaseImageUpdate = SupabaseTables['images']['Update'];

// Schedules
export type SupabaseScheduleRow = SupabaseTables['schedules']['Row'];
export type SupabaseScheduleInsert = SupabaseTables['schedules']['Insert'];
export type SupabaseScheduleUpdate = SupabaseTables['schedules']['Update'];

// Friends
export type SupabaseFriendRow = SupabaseTables['friends']['Row'];
export type SupabaseFriendInsert = SupabaseTables['friends']['Insert'];
export type SupabaseFriendUpdate = SupabaseTables['friends']['Update'];

// Likes
export type SupabaseLikeRow = SupabaseTables['likes']['Row'];
export type SupabaseLikeInsert = SupabaseTables['likes']['Insert'];
export type SupabaseLikeUpdate = SupabaseTables['likes']['Update'];

// Comments (ローカルのみ - Supabaseには存在しない)

// ===============================
// SQLite Tables (converted)
// ===============================

// Users
export type UserRow = ToSQLite<SupabaseUserRow>;
export type UserInsert = ToSQLite<SupabaseUserInsert>;
export type UserUpdate = ToSQLite<SupabaseUserUpdate>;

// Visits
export type VisitRow = ToSQLite<SupabaseVisitRow>;
export type VisitInsert = ToSQLite<SupabaseVisitInsert>;
export type VisitUpdate = ToSQLite<SupabaseVisitUpdate>;

// Posts (ローカル拡張フィールド追加)
export type PostRow = ToSQLite<SupabasePostRow> & {
  machi_id: string | null;
  likes_count: number;
  comments_count: number;
};
export type PostInsert = ToSQLite<SupabasePostInsert> & {
  machi_id?: string | null;
  likes_count?: number;
  comments_count?: number;
};
export type PostUpdate = ToSQLite<SupabasePostUpdate> & {
  machi_id?: string | null;
  likes_count?: number;
  comments_count?: number;
};

// Images
export type ImageRow = ToSQLite<SupabaseImageRow>;
export type ImageInsert = ToSQLite<SupabaseImageInsert>;
export type ImageUpdate = ToSQLite<SupabaseImageUpdate>;

// Schedules (ローカル拡張フィールド追加)
export type ScheduleRow = ToSQLite<SupabaseScheduleRow> & {
  completed_at: string | null;
};
export type ScheduleInsert = ToSQLite<SupabaseScheduleInsert> & {
  completed_at?: string | null;
};
export type ScheduleUpdate = ToSQLite<SupabaseScheduleUpdate> & {
  completed_at?: string | null;
};

// Friends
export type FriendRow = ToSQLite<SupabaseFriendRow>;
export type FriendInsert = ToSQLite<SupabaseFriendInsert>;
export type FriendUpdate = ToSQLite<SupabaseFriendUpdate>;

// Likes
export type LikeRow = ToSQLite<SupabaseLikeRow>;
export type LikeInsert = ToSQLite<SupabaseLikeInsert>;
export type LikeUpdate = ToSQLite<SupabaseLikeUpdate>;

// Comments (ローカルのみ)
export interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}

// ===============================
// Local-only Tables
// ===============================

/**
 * Prefecture (都道府県マスター)
 */
export interface PrefectureRow {
  id: string;          // "tokyo", "kanagawa"
  name: string;        // "東京都", "神奈川県"
  name_kana: string;   // "とうきょうと"
  region: string;      // "関東", "近畿"
  created_at: string;
  updated_at: string;
}

/**
 * City (市区町村マスター)
 */
export interface CityRow {
  id: string;            // "shibuya", "minato"
  prefecture_id: string; // "tokyo"
  name: string;          // "渋谷区", "港区"
  name_kana: string;     // "しぶやく"
  type: string;          // "区", "市", "町", "村"
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
  latitude: number;
  longitude: number;
  line_name: string;
  prefecture_id: string;     // 追加: "tokyo", "kanagawa"
  city_id: string | null;    // 追加: "shibuya", "minato"
  prefecture: string;        // 後方互換: "東京都"（将来削除予定）
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
 * Convert Supabase Visit Row to SQLite Visit Row
 * Supabase: boolean | null → SQLite: 0 | 1 | null
 */
export function convertSupabaseVisitToSQLite(
  supabaseVisit: SupabaseVisitRow
): VisitRow {
  return {
    ...supabaseVisit,
    is_synced: booleanToSQLiteBoolean(supabaseVisit.is_synced),
  };
}

// ===============================
// Re-export common types
// ===============================

export type { Database } from './supabase.generated';
