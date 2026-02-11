/**
 * Maps API 内部用型定義・マッパー
 */

import type { Database, Json } from "@machikore/database";
import type { TagBasicInfo, MapWithUser } from "@/shared/types";
import {
  parseProseMirrorDoc,
  parseThumbnailCrop,
  parseTagsArray,
} from "@/shared/types";

// ===============================
// ベース Row 型
// ===============================

type MapRow = Database["public"]["Tables"]["maps"]["Row"];
type MapPublicRow = Database["public"]["Views"]["maps_public"]["Row"];
type MvPopularMapsRow = Database["public"]["Views"]["mv_popular_maps"]["Row"];
type MvTodayPicksMapsRow =
  Database["public"]["Views"]["mv_today_picks_maps"]["Row"];
type MvMapRow = MvPopularMapsRow | MvTodayPicksMapsRow;

// ===============================
// JOIN レスポンス型
// ===============================

interface UserJoin {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  avatar_crop: Json | null;
}

interface MapTagWithTag {
  tags: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * maps テーブル + JOIN レスポンス型
 */
export interface SupabaseMapResponse extends MapRow {
  users: UserJoin | null;
  map_tags: MapTagWithTag[];
}

/**
 * maps_public ビュー + JOIN レスポンス型
 */
export interface SupabaseMapPublicResponse extends MapPublicRow {
  users: UserJoin | null;
  map_tags: MapTagWithTag[];
}

// ===============================
// マッパー関数
// ===============================

/**
 * maps テーブル + JOIN → MapWithUser
 */
export function mapResponseToMapWithUser(
  map: SupabaseMapResponse
): MapWithUser {
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
    thumbnail_crop: parseThumbnailCrop(map.thumbnail_crop),
    spots_count: map.spots_count,
    likes_count: map.likes_count,
    bookmarks_count: map.bookmarks_count ?? 0,
    comments_count: map.comments_count ?? 0,
    created_at: map.created_at,
    updated_at: map.updated_at,
    user: map.users
      ? {
          id: map.users.id,
          username: map.users.username,
          display_name: map.users.display_name,
          avatar_url: map.users.avatar_url,
          avatar_crop: parseThumbnailCrop(map.users.avatar_crop),
        }
      : null,
    article_intro: parseProseMirrorDoc(map.article_intro),
    article_outro: parseProseMirrorDoc(map.article_outro),
    total_view_count: map.total_view_count ?? 0,
    show_label_chips: map.show_label_chips ?? false,
    language: map.language ?? null,
    tags: tags.length > 0 ? tags : undefined,
    is_liked: false,
    is_bookmarked: false,
  };
}

/**
 * maps_public ビュー + JOIN → MapWithUser
 */
export function mapPublicResponseToMapWithUser(
  map: SupabaseMapPublicResponse
): MapWithUser {
  const tags: TagBasicInfo[] = (map.map_tags || [])
    .map((mt) => mt.tags)
    .filter(Boolean);

  return {
    id: map.id ?? "",
    user_id: map.user_id ?? "",
    name: map.name ?? "",
    description: map.description ?? null,
    category_id: map.category_id ?? null,
    is_public: map.is_public ?? false,
    is_official: map.is_official ?? false,
    thumbnail_url: map.thumbnail_url ?? null,
    thumbnail_crop: parseThumbnailCrop(map.thumbnail_crop),
    spots_count: map.spots_count ?? 0,
    likes_count: map.likes_count ?? 0,
    bookmarks_count: map.bookmarks_count ?? 0,
    comments_count: map.comments_count ?? 0,
    created_at: map.created_at ?? "",
    updated_at: map.updated_at ?? "",
    user: map.users
      ? {
          id: map.users.id,
          username: map.users.username,
          display_name: map.users.display_name,
          avatar_url: map.users.avatar_url,
          avatar_crop: parseThumbnailCrop(map.users.avatar_crop),
        }
      : null,
    article_intro: parseProseMirrorDoc(map.article_intro),
    article_outro: parseProseMirrorDoc(map.article_outro),
    total_view_count: 0,
    show_label_chips: map.show_label_chips ?? null,
    language: map.language ?? null,
    tags: tags.length > 0 ? tags : undefined,
    is_liked: false,
    is_bookmarked: false,
  };
}

/**
 * マテリアライズドビュー → MapWithUser
 */
export function mvRowToMapWithUser(row: MvMapRow): MapWithUser {
  const tags = parseTagsArray(row.tags);

  return {
    id: row.id ?? "",
    user_id: row.user_id ?? "",
    name: row.name ?? "",
    description: row.description ?? null,
    category_id: row.category_id ?? null,
    is_public: row.is_public ?? false,
    is_official: row.is_official ?? false,
    thumbnail_url: row.thumbnail_url ?? null,
    thumbnail_crop: parseThumbnailCrop(row.thumbnail_crop),
    spots_count: row.spots_count ?? 0,
    likes_count: row.likes_count ?? 0,
    bookmarks_count: row.bookmarks_count ?? 0,
    comments_count: row.comments_count ?? 0,
    total_view_count: 0,
    article_intro: parseProseMirrorDoc(row.article_intro),
    article_outro: parseProseMirrorDoc(row.article_outro),
    show_label_chips: row.show_label_chips ?? null,
    language: row.language ?? null,
    created_at: row.created_at ?? "",
    updated_at: row.updated_at ?? "",
    user: row.user_username
      ? {
          id: row.user_id ?? "",
          username: row.user_username,
          display_name: row.user_display_name ?? null,
          avatar_url: row.user_avatar_url ?? null,
          avatar_crop: parseThumbnailCrop(row.user_avatar_crop),
        }
      : null,
    tags: tags.length > 0 ? tags : undefined,
    is_liked: false,
    is_bookmarked: false,
  };
}
