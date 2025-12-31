/**
 * フォロー中ユーザーのマップ取得
 */

import { supabase, handleSupabaseError } from '../client';
import type { MapWithUser } from '@/shared/types';
import { mapResponseToMapWithUser, type SupabaseMapResponse } from './types';

/**
 * フォロー中ユーザーの公開マップ一覧を取得
 * @param userId 現在のユーザーID
 */
export async function getFollowingUsersMaps(
  userId: string,
  limit: number = 50,
  offset: number = 0
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

  // 2. フォロー中ユーザーの公開マップを取得
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('is_public', true)
    .in('user_id', followingUserIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    handleSupabaseError('getFollowingUsersMaps', error);
  }

  return (data || []).map((map: SupabaseMapResponse) => mapResponseToMapWithUser(map));
}
