/**
 * フォロー中ユーザーのマップ取得
 * cursor方式のページネーション対応
 */

import { supabase, handleSupabaseError } from '../client';
import { FEED_PAGE_SIZE } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';
import { mapPublicResponseToMapWithUser, type SupabaseMapPublicResponse } from './types';

/**
 * フォロー中ユーザーの公開マップ一覧を取得（cursor方式ページネーション対応）
 * @param userId 現在のユーザーID
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 * ※ spots_countは公開スポット数のみ（maps_publicビュー使用）
 */
export async function getFollowingUsersMaps(
  userId: string,
  limit: number = FEED_PAGE_SIZE,
  cursor?: string
): Promise<MapWithUser[]> {
  // 1. フォロー中のユーザーIDを取得
  const { data: followsData, error: followsError } = await supabase
    .from('follows')
    .select('followee_id')
    .eq('follower_id', userId);

  if (followsError) {
    handleSupabaseError('getFollowingUsersMaps:follows', followsError);
  }

  const followingUserIds = (followsData || []).map((f) => f.followee_id);

  // フォロー中のユーザーがいない場合は空配列を返す
  if (followingUserIds.length === 0) {
    return [];
  }

  // 2. フォロー中ユーザーの公開マップを取得（タグも含む）
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
      )
    `)
    .in('user_id', followingUserIds)
    .order('created_at', { ascending: false })
    .limit(limit);

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getFollowingUsersMaps', error);
  }

  return (data || []).map((map: SupabaseMapPublicResponse) => mapPublicResponseToMapWithUser(map));
}
