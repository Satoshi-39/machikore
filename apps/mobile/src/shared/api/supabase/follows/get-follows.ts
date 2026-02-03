/**
 * フォロワー/フォロー中一覧取得（ページネーション対応）
 */

import { supabase, handleSupabaseError } from '../client';
import { FOLLOWS_PAGE_SIZE } from '@/shared/config/constants';
import type { FollowRecord, FollowsPage } from './types';

/**
 * フォロワー一覧を取得（自分をフォローしているユーザー）
 */
export async function getFollowers(
  userId: string,
  cursor?: string | null
): Promise<FollowsPage> {
  let query = supabase
    .from('follows')
    .select(`
      id,
      created_at,
      follower:users!follows_follower_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop,
        bio
      )
    `)
    .eq('followee_id', userId)
    .order('created_at', { ascending: false })
    .limit(FOLLOWS_PAGE_SIZE + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getFollowers', error);
  }

  const items = data || [];
  const hasMore = items.length > FOLLOWS_PAGE_SIZE;
  const pageItems = hasMore ? items.slice(0, FOLLOWS_PAGE_SIZE) : items;

  const followers: FollowRecord[] = pageItems.map((item: any) => ({
    id: item.id,
    created_at: item.created_at,
    user: item.follower,
  }));

  const lastItem = pageItems[pageItems.length - 1];

  return {
    data: followers,
    nextCursor: hasMore && lastItem ? lastItem.created_at : null,
    hasMore,
  };
}

/**
 * フォロー中一覧を取得（自分がフォローしているユーザー）
 */
export async function getFollowing(
  userId: string,
  cursor?: string | null
): Promise<FollowsPage> {
  let query = supabase
    .from('follows')
    .select(`
      id,
      created_at,
      followee:users!follows_followee_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop,
        bio
      )
    `)
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })
    .limit(FOLLOWS_PAGE_SIZE + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getFollowing', error);
  }

  const items = data || [];
  const hasMore = items.length > FOLLOWS_PAGE_SIZE;
  const pageItems = hasMore ? items.slice(0, FOLLOWS_PAGE_SIZE) : items;

  const following: FollowRecord[] = pageItems.map((item: any) => ({
    id: item.id,
    created_at: item.created_at,
    user: item.followee,
  }));

  const lastItem = pageItems[pageItems.length - 1];

  return {
    data: following,
    nextCursor: hasMore && lastItem ? lastItem.created_at : null,
    hasMore,
  };
}
