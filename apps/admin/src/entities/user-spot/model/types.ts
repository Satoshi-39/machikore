import type { PaginationParams } from "@/shared/types";

/**
 * User Spot 型定義
 */

/** スポット一覧用 */
export type Spot = {
  id: string;
  description: string;
  prefecture_name: string | null;
  machi_name: string | null;
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  created_at: string;
  user: {
    display_name: string;
    username: string;
  } | null;
};

/** スポット検索パラメータ */
export type GetSpotsParams = PaginationParams & {
  query?: string;
  visibility?: string[];
};

/** スポット詳細用 */
export type SpotDetail = {
  id: string;
  description: string;
  prefecture_name: string | null;
  city_name: string | null;
  machi_name: string | null;
  google_formatted_address: string | null;
  latitude: number;
  longitude: number;
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  images_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    display_name: string;
    username: string;
  } | null;
  map: {
    id: string;
    name: string;
  } | null;
};
