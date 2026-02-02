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
    name: Json | null;
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
      display_name: string;
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
      username: string;
      display_name: string;
      avatar_url: string | null;
    } | null;
  } | null;
}

/** ブックマークの軽量データ（フォルダ集計用） */
export interface BookmarkMinimal {
  folder_id: string | null;
  user_spot_id: string | null;
  map_id: string | null;
}

/** ブックマークしたスポットの型 */
export interface BookmarkedSpotItem {
  bookmarkId: string;
  bookmarkedAt: string;
  folderId: string | null;
  spot: {
    id: string;
    user_id: string;
    map_id: string;
    name: Json | null;
    description: string;
    likes_count: number;
    bookmarks_count: number;
    comments_count: number;
    created_at: string;
    google_short_address: Json | null;
    master_spot: {
      id: string;
      name: Json;
      google_short_address: Json | null;
      latitude: number;
      longitude: number;
    } | null;
    user: {
      id: string;
      username: string;
      display_name: string;
      avatar_url: string | null;
    } | null;
    thumbnail_image: {
      id: string;
      cloud_path: string;
    } | null;
  };
}

/** ブックマークしたマップの型 */
export interface BookmarkedMapItem {
  bookmarkId: string;
  bookmarkedAt: string;
  folderId: string | null;
  map: {
    id: string;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    spots_count: number;
    likes_count: number;
    user: {
      id: string;
      username: string;
      display_name: string;
      avatar_url: string | null;
    } | null;
  };
}
