/**
 * User Spots API 型定義
 */

import type { Database } from '@/shared/types/supabase.generated';
import type { ProseMirrorDoc } from '@/shared/types';

export type MasterSpotInsert = Database['public']['Tables']['master_spots']['Insert'];
export type MasterSpotRow = Database['public']['Tables']['master_spots']['Row'];
export type UserSpotInsert = Database['public']['Tables']['user_spots']['Insert'];
export type UserSpotRow = Database['public']['Tables']['user_spots']['Row'];

export interface CreateSpotInput {
  userId: string;
  mapId: string;
  machiId?: string | null;
  prefectureId?: string | null;
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
  customName?: string | null;
  description?: string | null;
  articleContent?: string | null;
}

export interface UpdateSpotInput {
  id: string;
  custom_name?: string;
  description?: string | null;
  article_content?: ProseMirrorDoc | null;
  order_index?: number;
  map_id?: string;
}

export interface UserSpotWithMasterSpot extends UserSpotRow {
  master_spot: MasterSpotRow | null;
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
  custom_name: string | null;
  description: string | null;
  tags: string[] | null;
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
    google_formatted_address: string | null;
    google_short_address: string | null;
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
    theme_color: string;
  } | null;
}

/**
 * マップ内スポット検索結果の型
 */
export interface MapSpotSearchResult {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
}
