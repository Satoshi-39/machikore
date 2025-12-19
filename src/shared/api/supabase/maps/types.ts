/**
 * Maps API 内部用型定義
 */

import type { ProseMirrorDoc } from '@/shared/types';

/**
 * Supabaseからのマップレスポンス型
 */
export interface SupabaseMapResponse {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  category_id: string | null;
  is_public: boolean;
  is_default: boolean;
  is_official: boolean;
  thumbnail_url: string | null;
  theme_color: string | null;
  spots_count: number;
  likes_count: number;
  bookmarks_count: number | null;
  comments_count: number | null;
  created_at: string;
  updated_at: string;
  is_article_public: boolean | null;
  article_intro: ProseMirrorDoc | null;
  article_outro: ProseMirrorDoc | null;
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
    category: map.category,
    category_id: map.category_id,
    is_public: map.is_public,
    is_default: map.is_default,
    is_official: map.is_official,
    thumbnail_url: map.thumbnail_url,
    theme_color: map.theme_color,
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
  };
}
