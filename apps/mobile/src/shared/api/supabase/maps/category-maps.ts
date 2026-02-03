/**
 * カテゴリ別マップ取得
 */

import { supabase } from '../client';
import type { MapWithUser } from '@/shared/types';
import { log } from '@/shared/config/logger';
import { mapPublicResponseToMapWithUser, type SupabaseMapPublicResponse } from './types';

/**
 * カテゴリ別人気マップを取得（いいね数順）
 * @param categoryId カテゴリID
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 * ※ spots_countは公開スポット数のみ（maps_publicビュー使用）
 */
export async function getPopularMapsByCategory(
  categoryId: string,
  limit: number = 10,
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
      likes(id, user_id),
      bookmarks(id, user_id)
    `)
    .eq('category_id', categoryId)
    .order('likes_count', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error getting popular maps by category:', error);
    return [];
  }

  return (data || []).map((map: SupabaseMapPublicResponse & { likes?: any[]; bookmarks?: any[] }) => ({
    ...mapPublicResponseToMapWithUser(map),
    is_liked: currentUserId
      ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
      : false,
    is_bookmarked: currentUserId
      ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
      : false,
  }));
}

/**
 * カテゴリ別新着マップを取得（作成日順）
 * @param categoryId カテゴリID
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 * ※ spots_countは公開スポット数のみ（maps_publicビュー使用）
 */
export async function getLatestMapsByCategory(
  categoryId: string,
  limit: number = 10,
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
      likes(id, user_id),
      bookmarks(id, user_id)
    `)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error getting latest maps by category:', error);
    return [];
  }

  return (data || []).map((map: SupabaseMapPublicResponse & { likes?: any[]; bookmarks?: any[] }) => ({
    ...mapPublicResponseToMapWithUser(map),
    is_liked: currentUserId
      ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
      : false,
    is_bookmarked: currentUserId
      ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
      : false,
  }));
}
