/**
 * 単一マップ取得
 */

import { supabase, handleSupabaseError } from '../client';
import type { MapWithUser } from '@/shared/types';
import { mapResponseToMapWithUser } from './types';

/**
 * マップ詳細を取得（IDで）
 * @param mapId マップID
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
export async function getMapById(
  mapId: string,
  currentUserId?: string | null
): Promise<MapWithUser | null> {
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
    .eq('id', mapId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    handleSupabaseError('getMapById', error);
  }

  if (!data) return null;

  const baseMap = mapResponseToMapWithUser(data);

  // いいね・ブックマーク状態を設定
  const isLiked = currentUserId
    ? ((data as any).likes || []).some((like: any) => like.user_id === currentUserId)
    : false;
  const isBookmarked = currentUserId
    ? ((data as any).bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
    : false;

  return {
    ...baseMap,
    is_liked: isLiked,
    is_bookmarked: isBookmarked,
  };
}
