/**
 * Maps API 内部用型定義
 */

import type { Database } from '@/shared/types/database.types';

// MergeDeepで拡張されたDatabase型からマップのRow型を取得
type MapRow = Database['public']['Tables']['maps']['Row'];

/**
 * Supabaseからのマップレスポンス型（JOINでusersを含む）
 */
export interface SupabaseMapResponse extends MapRow {
  users?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

/**
 * SupabaseMapResponseをMapWithUserに変換するヘルパー
 */
export function mapResponseToMapWithUser(map: SupabaseMapResponse) {
  return {
    id: map.id,
    user_id: map.user_id,
    name: map.name,
    description: map.description,
    category_id: map.category_id,
    is_public: map.is_public,
    is_default: map.is_default,
    is_official: map.is_official,
    thumbnail_url: map.thumbnail_url,
    spots_count: map.spots_count,
    likes_count: map.likes_count,
    bookmarks_count: map.bookmarks_count ?? 0,
    comments_count: map.comments_count ?? 0,
    created_at: map.created_at,
    updated_at: map.updated_at,
    user: map.users || null,
    is_article_public: map.is_article_public ?? false,
    article_intro: map.article_intro ?? null,
    article_outro: map.article_outro ?? null,
    show_label_chips: map.show_label_chips ?? false,
  };
}
