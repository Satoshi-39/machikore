/**
 * Database Types
 *
 * Supabase型を基準に、SQLite用の型を自動生成
 * JSONカラムはMergeDeepで適切な型に上書き
 *
 * 参考: https://github.com/orgs/supabase/discussions/32925
 */

import type { MergeDeep } from 'type-fest';
import type { Database as DatabaseGenerated } from './supabase.generated';
import type { ProseMirrorDoc } from './composite.types';

// ===============================
// JSON カラム用の型定義
// ===============================

/** 多言語翻訳用の型 */
type NameTranslations = { [key: string]: string } | null;

/**
 * 拡張されたDatabase型
 *
 * Supabase CLIが生成した型のJSONカラムを適切な型に上書き
 * 参考: https://github.com/orgs/supabase/discussions/32925
 */
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        // user_spots: 記事コンテンツ
        user_spots: {
          Row: { article_content: ProseMirrorDoc | null };
          Insert: { article_content?: ProseMirrorDoc | null };
          Update: { article_content?: ProseMirrorDoc | null };
        };
        // maps: 記事のまえがき・あとがき、ラベルチップ表示設定
        maps: {
          Row: {
            article_intro: ProseMirrorDoc | null;
            article_outro: ProseMirrorDoc | null;
            show_label_chips: boolean;
          };
          Insert: {
            article_intro?: ProseMirrorDoc | null;
            article_outro?: ProseMirrorDoc | null;
            show_label_chips?: boolean;
          };
          Update: {
            article_intro?: ProseMirrorDoc | null;
            article_outro?: ProseMirrorDoc | null;
            show_label_chips?: boolean;
          };
        };
        // categories: 多言語対応
        categories: {
          Row: { name_translations: NameTranslations };
          Insert: { name_translations?: NameTranslations };
          Update: { name_translations?: NameTranslations };
        };
        // cities: 多言語対応
        cities: {
          Row: { name_translations: NameTranslations };
          Insert: { name_translations?: NameTranslations };
          Update: { name_translations?: NameTranslations };
        };
        // tags: 多言語対応
        tags: {
          Row: { name_translations: NameTranslations };
          Insert: { name_translations?: NameTranslations };
          Update: { name_translations?: NameTranslations };
        };
        // machi: 多言語対応
        machi: {
          Row: {
            name_translations: NameTranslations;
            city_name_translations: NameTranslations;
            prefecture_name_translations: NameTranslations;
          };
          Insert: {
            name_translations?: NameTranslations;
            city_name_translations?: NameTranslations;
            prefecture_name_translations?: NameTranslations;
          };
          Update: {
            name_translations?: NameTranslations;
            city_name_translations?: NameTranslations;
            prefecture_name_translations?: NameTranslations;
          };
        };
      };
    };
  }
>;

// ===============================
// Supabase Tables (Database型から派生)
// ===============================

// Users
export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

// Maps
export type MapRow = Database['public']['Tables']['maps']['Row'];
export type MapInsert = Database['public']['Tables']['maps']['Insert'];
export type MapUpdate = Database['public']['Tables']['maps']['Update'];

// Master Spots
export type MasterSpotRow = Database['public']['Tables']['master_spots']['Row'];
export type MasterSpotInsert = Database['public']['Tables']['master_spots']['Insert'];
export type MasterSpotUpdate = Database['public']['Tables']['master_spots']['Update'];

// User Spots (旧Spots)
export type UserSpotRow = Database['public']['Tables']['user_spots']['Row'];
export type UserSpotInsert = Database['public']['Tables']['user_spots']['Insert'];
export type UserSpotUpdate = Database['public']['Tables']['user_spots']['Update'];
// 後方互換性のためにSpotRowもエクスポート
export type SpotRow = UserSpotRow;
export type SpotInsert = UserSpotInsert;
export type SpotUpdate = UserSpotUpdate;

// Visits
export type VisitRow = Database['public']['Tables']['visits']['Row'];
export type VisitInsert = Database['public']['Tables']['visits']['Insert'];
export type VisitUpdate = Database['public']['Tables']['visits']['Update'];

// Images
export type ImageRow = Database['public']['Tables']['images']['Row'];
export type ImageInsert = Database['public']['Tables']['images']['Insert'];
export type ImageUpdate = Database['public']['Tables']['images']['Update'];

// Follows
export type FollowRow = Database['public']['Tables']['follows']['Row'];
export type FollowInsert = Database['public']['Tables']['follows']['Insert'];
export type FollowUpdate = Database['public']['Tables']['follows']['Update'];

// Likes
export type LikeRow = Database['public']['Tables']['likes']['Row'];
export type LikeInsert = Database['public']['Tables']['likes']['Insert'];
export type LikeUpdate = Database['public']['Tables']['likes']['Update'];

// Comments
export type CommentRow = Database['public']['Tables']['comments']['Row'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];
export type CommentUpdate = Database['public']['Tables']['comments']['Update'];

// Bookmarks
export type BookmarkRow = Database['public']['Tables']['bookmarks']['Row'];
export type BookmarkInsert = Database['public']['Tables']['bookmarks']['Insert'];
export type BookmarkUpdate = Database['public']['Tables']['bookmarks']['Update'];

// ===============================
// 地理マスターテーブル（Database型から派生）
// ===============================

// Continents (大陸)
export type ContinentRow = Database['public']['Tables']['continents']['Row'];

// Countries (国)
export type CountryRow = Database['public']['Tables']['countries']['Row'];

// Regions (地方)
export type RegionRow = Database['public']['Tables']['regions']['Row'];

// Prefectures (都道府県)
export type PrefectureRow = Database['public']['Tables']['prefectures']['Row'];

// Cities (市区町村)
export type CityRow = Database['public']['Tables']['cities']['Row'];

// Machi (街)
export type MachiRow = Database['public']['Tables']['machi']['Row'];

// Schedules (予定)
export type ScheduleRow = Database['public']['Tables']['schedules']['Row'];
export type ScheduleInsert = Database['public']['Tables']['schedules']['Insert'];
export type ScheduleUpdate = Database['public']['Tables']['schedules']['Update'];

// ===============================
// 複合型（JOINなど）
// ===============================

/**
 * user_spots + master_spots を結合した型
 */
export type SpotWithMasterSpot = UserSpotRow & {
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  google_place_id: string | null;
  google_types: string | null;
  google_phone_number: string | null;
  google_website_uri: string | null;
  google_rating: number | null;
  google_user_rating_count: number | null;
};
