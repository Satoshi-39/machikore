import type { PaginationParams } from "@/shared/types";

/**
 * Map 型定義
 */

/** マップ一覧用 */
export type Map = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  is_official: boolean;
  spots_count: number;
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  category_id: string | null;
  created_at: string;
  user: {
    display_name: string;
    username: string;
  } | null;
  category: {
    name: string;
  } | null;
};

/** マップ検索パラメータ */
export type GetMapsParams = PaginationParams & {
  query?: string;
  visibility?: string[];
  official?: string[];
};

/** マップ詳細用 */
export type MapDetail = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  is_official: boolean;
  thumbnail_url: string | null;
  spots_count: number;
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  category_id: string | null;
  language: string | null;
  show_label_chips: boolean | null;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  labels: {
    id: string;
    name: string;
    color: string;
    sort_order: number;
  }[];
};
