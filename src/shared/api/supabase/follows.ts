/**
 * Supabase Follows API
 * フォロー機能
 */

import { supabase, handleSupabaseError } from './client';

// フォロー関係の情報
export interface FollowUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface FollowWithUser {
  id: string;
  created_at: string;
  user: FollowUser;
}

// ===============================
// フォロー状態確認
// ===============================

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

// ===============================
// フォロー操作
// ===============================

/**
 * ユーザーをフォローする
 */
export async function followUser(
  followerId: string,
  followeeId: string
): Promise<void> {
  // 自分自身はフォローできない
  if (followerId === followeeId) {
    throw new Error('Cannot follow yourself');
  }

  const { error } = await supabase.from('follows').insert({
    follower_id: followerId,
    followee_id: followeeId,
  });

  if (error) {
    // 既にフォロー済みの場合は無視
    if (error.code === '23505') {
      console.log('[followUser] Already following');
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

/**
 * フォロー状態をトグル
 */
export async function toggleFollow(
  followerId: string,
  followeeId: string
): Promise<boolean> {
  const isFollowing = await checkIsFollowing(followerId, followeeId);

  if (isFollowing) {
    await unfollowUser(followerId, followeeId);
    return false;
  } else {
    await followUser(followerId, followeeId);
    return true;
  }
}

// ===============================
// フォロワー/フォロー中一覧
// ===============================

/**
 * フォロワー一覧を取得（自分をフォローしているユーザー）
 */
export async function getFollowers(
  userId: string,
  limit: number = 50
): Promise<FollowWithUser[]> {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      id,
      created_at,
      follower:users!follows_follower_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        bio
      )
    `)
    .eq('followee_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getFollowers', error);
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    created_at: item.created_at,
    user: item.follower,
  }));
}

/**
 * フォロー中一覧を取得（自分がフォローしているユーザー）
 */
export async function getFollowing(
  userId: string,
  limit: number = 50
): Promise<FollowWithUser[]> {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      id,
      created_at,
      followee:users!follows_followee_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        bio
      )
    `)
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getFollowing', error);
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    created_at: item.created_at,
    user: item.followee,
  }));
}

// ===============================
// フォロワー/フォロー中カウント
// ===============================

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
