/**
 * Machi 型定義
 */

/** 街一覧用 */
export type Machi = {
  id: string;
  name: string;
  name_kana: string | null;
  latitude: number | null;
  longitude: number | null;
  prefecture_id: string;
  prefecture_name: string;
  city_id: string | null;
  city_name: string | null;
  place_type: string | null;
  created_at: string;
};

/** 街詳細用 */
export type MachiDetail = {
  id: string;
  name: string;
  name_kana: string | null;
  name_translations: Record<string, string> | null;
  latitude: number | null;
  longitude: number | null;
  prefecture_id: string;
  prefecture_name: string;
  prefecture_name_translations: Record<string, string> | null;
  city_id: string | null;
  city_name: string | null;
  city_name_translations: Record<string, string> | null;
  osm_id: number | null;
  place_type: string | null;
  tile_id: string | null;
  created_at: string;
  updated_at: string;
  spots_count: number;
};
