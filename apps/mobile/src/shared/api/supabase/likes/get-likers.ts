/**
 * いいねしたユーザー一覧取得
 */

import { supabase, handleSupabaseError } from '../client';

/**
 * スポットにいいねしたユーザー一覧を取得
 */
export async function getSpotLikers(spotId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('likes')
    .select(`
      id,
      created_at,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('user_spot_id', spotId)
    .order('created_at', { ascending: false })
    .limit(limit);

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
 * マップにいいねしたユーザー一覧を取得
 */
export async function getMapLikers(mapId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('likes')
    .select(`
      id,
      created_at,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('map_id', mapId)
    .order('created_at', { ascending: false })
    .limit(limit);

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
