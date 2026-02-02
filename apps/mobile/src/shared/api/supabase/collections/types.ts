/**
 * コレクション機能の型定義
 */

import type { Database } from '@/shared/types/database.types';

export type Collection = Database['public']['Tables']['collections']['Row'];

export interface CollectionWithUser extends Collection {
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
  is_liked?: boolean;
}

export type CollectionMap = Database['public']['Tables']['collection_maps']['Row'];

export interface CollectionMapWithDetails extends CollectionMap {
  map: {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    spots_count: number;
    likes_count: number;
    bookmarks_count: number;
    is_public: boolean;
    created_at: string;
    is_liked?: boolean;
    is_bookmarked?: boolean;
    user: {
      id: string;
      username: string;
      display_name: string;
      avatar_url: string | null;
    } | null;
  } | null;
}
