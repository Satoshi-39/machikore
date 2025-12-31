/**
 * Bookmarks API 型定義
 */

import type { Database } from '@/shared/types/database.types';

export type BookmarkFolderType = 'spots' | 'maps';

// MergeDeepで拡張されたDatabase型から取得
export type BookmarkFolder = Database['public']['Tables']['bookmark_folders']['Row'];
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];

export interface BookmarkWithDetails extends Bookmark {
  spot?: {
    id: string;
    custom_name: string | null;
    description: string | null;
    likes_count: number;
    /** ピン刺し・現在地登録の場合の短縮住所（表示用） */
    google_short_address: string | null;
    master_spot: {
      id: string;
      name: string;
      google_short_address: string | null;
      latitude: number;
      longitude: number;
    } | null;
    user: {
      id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
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
