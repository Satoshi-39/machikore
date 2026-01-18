/**
 * フォロワー/フォロー中カウント取得
 */

import { supabase, handleSupabaseError } from '../client';

/**
 * フォロワー数を取得
 */
export async function getFollowersCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('followee_id', userId);

  if (error) {
    handleSupabaseError('getFollowersCount', error);
  }

  return count ?? 0;
}

/**
 * フォロー中の数を取得
 */
export async function getFollowingCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (error) {
    handleSupabaseError('getFollowingCount', error);
  }

  return count ?? 0;
}

/**
 * フォロワー数とフォロー中数を同時に取得
 */
export async function getFollowCounts(
  userId: string
): Promise<{ followers: number; following: number }> {
  const [followers, following] = await Promise.all([
    getFollowersCount(userId),
    getFollowingCount(userId),
  ]);

  return { followers, following };
}
