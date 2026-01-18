/**
 * フォロー状態確認
 */

import { supabase, handleSupabaseError } from '../client';

/**
 * 指定ユーザーをフォローしているか確認
 */
export async function checkIsFollowing(
  followerId: string,
  followeeId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('followee_id', followeeId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkIsFollowing', error);
  }

  return data !== null;
}

/**
 * 複数ユーザーへのフォロー状態を一括確認
 */
export async function checkIsFollowingBatch(
  followerId: string,
  followeeIds: string[]
): Promise<Set<string>> {
  if (followeeIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from('follows')
    .select('followee_id')
    .eq('follower_id', followerId)
    .in('followee_id', followeeIds);

  if (error) {
    handleSupabaseError('checkIsFollowingBatch', error);
  }

  return new Set((data || []).map((f) => f.followee_id));
}
