/**
 * Maps API 内部用型定義
 */

import type { Database } from '@/shared/types/database.types';
import { parseProseMirrorDoc, type TagBasicInfo } from '@/shared/types';

// MergeDeepで拡張されたDatabase型からマップのRow型を取得
type MapRow = Database['public']['Tables']['maps']['Row'];

/**
 * JOINで取得したタグ情報（map_tags経由）
 */
interface MapTagWithTag {
  tags: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Supabaseからのマップレスポンス型（JOINでusersとtagsを含む）
 */
export interface SupabaseMapResponse extends MapRow {
  users?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  map_tags?: MapTagWithTag[];
}

/**
 * SupabaseMapResponseをMapWithUserに変換するヘルパー
 */
export function mapResponseToMapWithUser(map: SupabaseMapResponse) {
  // map_tagsからタグ情報を抽出
  const tags: TagBasicInfo[] = (map.map_tags || [])
    .map((mt) => mt.tags)
    .filter(Boolean);

  return {
    id: map.id,
    user_id: map.user_id,
    name: map.name,
    description: map.description,
    category_id: map.category_id,
    is_public: map.is_public,
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
    language: map.language ?? null,
    tags: tags.length > 0 ? tags : undefined,
  };
}

// ===============================
// RPC用型定義
// ===============================

/**
 * search_public_maps RPCのレスポンス型
 * Supabaseが返すJSONB型のtagsを具体的な型で定義
 */
export interface SearchPublicMapsRpcRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  is_public: boolean;
  is_official: boolean;
  thumbnail_url: string | null;
  spots_count: number;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  is_article_public: boolean;
  article_intro: string | null;
  article_outro: string | null;
  show_label_chips: boolean;
  language: string | null;
  created_at: string;
  updated_at: string;
  // user fields (フラット)
  user_username: string | null;
  user_display_name: string | null;
  user_avatar_url: string | null;
  // tags (JSONB → 具体的な型で定義)
  tags: TagBasicInfo[] | null;
}

/**
 * search_public_maps RPCレスポンスをMapWithUserに変換するヘルパー
 */
export function rpcMapResponseToMapWithUser(row: SearchPublicMapsRpcRow) {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    description: row.description,
    category_id: row.category_id,
    is_public: row.is_public,
    is_official: row.is_official,
    thumbnail_url: row.thumbnail_url,
    spots_count: row.spots_count,
    likes_count: row.likes_count,
    bookmarks_count: row.bookmarks_count,
    comments_count: row.comments_count,
    is_article_public: row.is_article_public,
    article_intro: parseProseMirrorDoc(row.article_intro),
    article_outro: parseProseMirrorDoc(row.article_outro),
    show_label_chips: row.show_label_chips,
    language: row.language,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: row.user_username ? {
      id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      avatar_url: row.user_avatar_url,
    } : null,
    tags: row.tags && row.tags.length > 0 ? row.tags : undefined,
  };
}
