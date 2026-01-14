/**
 * Bookmarks API 型定義
 */

import type { Database, Json } from '@/shared/types/database.types';

export type BookmarkFolderType = 'spots' | 'maps';

// MergeDeepで拡張されたDatabase型から取得
export type BookmarkFolder = Database['public']['Tables']['bookmark_folders']['Row'];
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];

export interface BookmarkWithDetails extends Bookmark {
  spot?: {
    id: string;
    user_id: string;
    map_id: string;
    description: string;
    likes_count: number;
    bookmarks_count: number;
    comments_count: number;
    created_at: string;
    /** ピン刺し・現在地登録の場合の短縮住所（JSONB型） */
    google_short_address: Json | null;
    master_spot: {
      id: string;
      name: Json; // JSONB型（多言語対応）
      google_short_address: Json | null; // JSONB型
      latitude: number;
      longitude: number;
    } | null;
    user: {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
    thumbnail_image: {
      id: string;
      cloud_path: string;
    } | null;
  } | null;
  map?: {
    id: string;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    spots_count: number;
    likes_count: number;
    user: {
      id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  } | null;
}
