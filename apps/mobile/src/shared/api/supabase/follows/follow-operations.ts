/**
 * フォロー操作
 */

import { supabase, handleSupabaseError } from '../client';
import { log } from '@/shared/config/logger';

/**
 * ユーザーをフォローする
 */
export async function followUser(
  followerId: string,
  followeeId: string
): Promise<void> {
  if (followerId === followeeId) {
    throw new Error('Cannot follow yourself');
  }

  const { error } = await supabase.from('follows').insert({
    follower_id: followerId,
    followee_id: followeeId,
  });

  if (error) {
    if (error.code === '23505') {
      log.debug('[Follows] Already following');
      return;
    }
    handleSupabaseError('followUser', error);
  }
}

/**
 * ユーザーのフォローを解除する
 */
export async function unfollowUser(
  followerId: string,
  followeeId: string
): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('followee_id', followeeId);

  if (error) {
    handleSupabaseError('unfollowUser', error);
  }
}
