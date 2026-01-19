/**
 * 場所データの型定義
 */

import type { Database } from '@/shared/types/database.types';

// Supabaseの型をそのまま使用
export type MachiRow = Database['public']['Tables']['machi']['Row'];
export type CityRow = Database['public']['Tables']['cities']['Row'];
export type PrefectureRow = Database['public']['Tables']['prefectures']['Row'];

/**
 * 座標から行政区画を判定した結果
 * RPC関数 get_city_by_coordinate の戻り値
 */
export interface AdminBoundaryResult {
  country_id: string; // 国ID（例: "jp"）
  admin_level: number; // OSM admin_level
  prefecture_id: string; // 都道府県ID（例: "tokyo"）
  city_id: string; // 市区町村ID（例: "tokyo_shibuya"）
}

/**
 * スポットの地理情報（座標から行政区画を判定）
 */
export interface SpotLocationInfo {
  prefectureId: string | null;
  cityId: string | null;
}
