/**
 * マップ一覧取得
 * cursor方式のページネーション対応
 */

import { supabase, handleSupabaseError } from '../client';
import { FEED_PAGE_SIZE } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';
import {
  mapResponseToMapWithUser,
  mapPublicResponseToMapWithUser,
} from './types';

/**
 * 公開マップ一覧を取得（フィード用、cursor方式ページネーション対応）
 * ユーザー情報とタグも含めて取得
 * ※ spots_countは公開スポット数のみ（maps_publicビュー使用）
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
export async function getPublicMaps(
  limit: number = FEED_PAGE_SIZE,
  cursor?: string,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  let query = supabase
    .from('maps_public')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      map_tags (
        tags (
          id,
          name,
          slug
        )
      ),
      likes (
        id,
        user_id
      ),
      bookmarks (
        id,
        user_id
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getPublicMaps', error);
  }

  return (data || []).map((map: any) => {
    const baseMap = mapPublicResponseToMapWithUser(map);
    // いいね・ブックマーク状態を設定
    const isLiked = currentUserId
      ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
      : false;
    const isBookmarked = currentUserId
      ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
      : false;
    return {
      ...baseMap,
      is_liked: isLiked,
      is_bookmarked: isBookmarked,
    };
  });
}

/**
 * ユーザーの公開マップを取得
 * ※ spots_countは公開スポット数のみ（maps_publicビュー使用）
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
export async function getUserPublicMaps(
  userId: string,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('maps_public')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      map_tags (
        tags (
          id,
          name,
          slug
        )
      ),
      likes (
        id,
        user_id
      ),
      bookmarks (
        id,
        user_id
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    handleSupabaseError('getUserPublicMaps', error);
  }

  return (data || []).map((map: any) => {
    const baseMap = mapPublicResponseToMapWithUser(map);
    const isLiked = currentUserId
      ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
      : false;
    const isBookmarked = currentUserId
      ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
      : false;
    return {
      ...baseMap,
      is_liked: isLiked,
      is_bookmarked: isBookmarked,
    };
  });
}

/**
 * ユーザーの全マップを取得（公開・非公開含む）
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
export async function getUserMaps(
  userId: string,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      map_tags (
        tags (
          id,
          name,
          slug
        )
      ),
      likes (
        id,
        user_id
      ),
      bookmarks (
        id,
        user_id
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    handleSupabaseError('getUserMaps', error);
  }

  return (data || []).map((map: any) => {
    const baseMap = mapResponseToMapWithUser(map);
    const isLiked = currentUserId
      ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
      : false;
    const isBookmarked = currentUserId
      ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
      : false;
    return {
      ...baseMap,
      is_liked: isLiked,
      is_bookmarked: isBookmarked,
    };
  });
}
