/**
 * いいねしたユーザー一覧取得
 */

import { LIKERS_PAGE_SIZE } from '@/shared/config';
import { supabase, handleSupabaseError } from '../client';

/**
 * スポットにいいねしたユーザー一覧を取得
 */
export async function getSpotLikers(spotId: string, limit: number = LIKERS_PAGE_SIZE, cursor?: string) {
  let query = supabase
    .from('likes')
    .select(`
      id,
      created_at,
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      )
    `)
    .eq('user_spot_id', spotId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getSpotLikers', error);
  }

  return (data || [])
    .filter((like: any) => like.users !== null)
    .map((like: any) => ({
      likeId: like.id,
      likedAt: like.created_at,
      user: like.users,
    }));
}

/**
 * コレクションにいいねしたユーザー一覧を取得
 */
export async function getCollectionLikers(collectionId: string, limit: number = LIKERS_PAGE_SIZE, cursor?: string) {
  let query = supabase
    .from('likes')
    .select(`
      id,
      created_at,
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      )
    `)
    .eq('collection_id', collectionId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getCollectionLikers', error);
  }

  return (data || [])
    .filter((like: any) => like.users !== null)
    .map((like: any) => ({
      likeId: like.id,
      likedAt: like.created_at,
      user: like.users,
    }));
}

/**
 * マップにいいねしたユーザー一覧を取得
 */
export async function getMapLikers(mapId: string, limit: number = LIKERS_PAGE_SIZE, cursor?: string) {
  let query = supabase
    .from('likes')
    .select(`
      id,
      created_at,
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      )
    `)
    .eq('map_id', mapId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getMapLikers', error);
  }

  return (data || [])
    .filter((like: any) => like.users !== null)
    .map((like: any) => ({
      likeId: like.id,
      likedAt: like.created_at,
      user: like.users,
    }));
}
