/**
 * マスタースポットの型定義
 */

import type { Database, Json } from '@/shared/types/database.types';

export interface MasterSpotDisplay {
  id: string;
  name: Json; // JSONB型（多言語対応）
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: Json | null; // JSONB型（多言語対応）
  google_short_address: Json | null; // JSONB型（多言語対応）
  google_types: string[] | null;
  user_spots_count: number;
}

// Database型から取得
export type MasterSpotFavorite =
  Database['public']['Tables']['master_spot_favorites']['Row'];
