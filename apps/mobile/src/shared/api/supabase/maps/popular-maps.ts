/**
 * 人気マップ・本日のピックアップ API
 * マテリアライズドビュー（mv_popular_maps, mv_today_picks_maps）からデータを取得
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';
import type { MapWithUser, TagBasicInfo } from '@/shared/types';
import { parseProseMirrorDoc } from '@/shared/types';



/**
 * マテリアライズドビューの行をMapWithUserに変換
 */
function mvRowToMapWithUser(
  row: any,
  isLiked: boolean,
  isBookmarked: boolean
): MapWithUser {
  const tags: TagBasicInfo[] = Array.isArray(row.tags) ? row.tags : [];

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
    article_intro: parseProseMirrorDoc(
      typeof row.article_intro === 'string'
        ? row.article_intro
        : row.article_intro ? JSON.stringify(row.article_intro) : null
    ),
    article_outro: parseProseMirrorDoc(
      typeof row.article_outro === 'string'
        ? row.article_outro
        : row.article_outro ? JSON.stringify(row.article_outro) : null
    ),
    show_label_chips: row.show_label_chips,
    language: row.language,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: row.user_username
      ? {
          id: row.user_id,
          username: row.user_username,
          display_name: row.user_display_name,
          avatar_url: row.user_avatar_url,
        }
      : null,
    tags: tags.length > 0 ? tags : undefined,
    is_liked: isLiked,
    is_bookmarked: isBookmarked,
  };
}

/**
 * 人気マップを取得（マテリアライズドビュー mv_popular_maps から）
 * @param limit 取得件数
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態判定用）
 */
export async function fetchPopularMaps(
  limit: number = 10,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('mv_popular_maps')
    .select('*')
    .limit(limit);

  if (error) {
    log.error('[PopularMaps] Error fetching mv_popular_maps:', error);
    throw error;
  }

  if (!data || data.length === 0) return [];

  const mapIds = data.map((row: any) => row.id);

  // ユーザーのいいね・ブックマーク状態を取得
  const [likedSet, bookmarkedSet] = await getUserInteractions(mapIds, currentUserId);

  return data.map((row: any) =>
    mvRowToMapWithUser(row, likedSet.has(row.id), bookmarkedSet.has(row.id))
  );
}

/**
 * 本日のピックアップマップを取得（マテリアライズドビュー mv_today_picks_maps から）
 * @param limit 取得件数
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態判定用）
 */
export async function fetchTodayPicksMaps(
  limit: number = 10,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('mv_today_picks_maps')
    .select('*')
    .limit(limit);

  if (error) {
    log.error('[PopularMaps] Error fetching mv_today_picks_maps:', error);
    throw error;
  }

  if (!data || data.length === 0) return [];

  const mapIds = data.map((row: any) => row.id);

  const [likedSet, bookmarkedSet] = await getUserInteractions(mapIds, currentUserId);

  return data.map((row: any) =>
    mvRowToMapWithUser(row, likedSet.has(row.id), bookmarkedSet.has(row.id))
  );
}

/**
 * ユーザーのいいね・ブックマーク状態をまとめて取得
 */
async function getUserInteractions(
  mapIds: string[],
  currentUserId?: string | null
): Promise<[Set<string>, Set<string>]> {
  if (!currentUserId || mapIds.length === 0) {
    return [new Set(), new Set()];
  }

  const [likesResult, bookmarksResult] = await Promise.all([
    supabase
      .from('likes')
      .select('map_id')
      .eq('user_id', currentUserId)
      .in('map_id', mapIds),
    supabase
      .from('bookmarks')
      .select('map_id')
      .eq('user_id', currentUserId)
      .in('map_id', mapIds),
  ]);

  const likedSet = new Set(
    (likesResult.data ?? []).map((l: any) => l.map_id).filter(Boolean) as string[]
  );
  const bookmarkedSet = new Set(
    (bookmarksResult.data ?? []).map((b: any) => b.map_id).filter(Boolean) as string[]
  );

  return [likedSet, bookmarkedSet];
}
