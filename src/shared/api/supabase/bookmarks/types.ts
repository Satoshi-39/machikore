/**
 * Bookmarks API 型定義
 */

export type BookmarkFolderType = 'spots' | 'maps';

export interface BookmarkFolder {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  order_index: number;
  folder_type: BookmarkFolderType;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  map_id: string | null;
  user_spot_id: string | null;
  folder_id: string | null;
  created_at: string;
}

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
