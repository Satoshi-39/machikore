/**
 * Supabase Likes API
 * いいね機能（スポット・マップ）
 */

import { supabase } from './client';
import type { Database } from '@/shared/types/supabase.generated';

type LikeRow = Database['public']['Tables']['likes']['Row'];
type LikeInsert = Database['public']['Tables']['likes']['Insert'];

// ===============================
// スポットいいね
// ===============================

/**
 * ユーザーがスポットにいいねしているか確認
 */
export async function checkSpotLiked(userId: string, spotId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('spot_id', spotId)
    .maybeSingle();

  if (error) {
    console.error('[checkSpotLiked] Error:', error);
    throw error;
  }

  return data !== null;
}

/**
 * スポットにいいねを追加
 */
export async function addSpotLike(userId: string, spotId: string): Promise<LikeRow> {
  const insertData: LikeInsert = {
    user_id: userId,
    spot_id: spotId,
  };

  const { data, error } = await supabase
    .from('likes')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('[addSpotLike] Error:', error);
    throw error;
  }

  // user_spotsのlikes_countをインクリメント
  const { error: rpcError } = await supabase.rpc('increment_spot_likes_count', { spot_id: spotId });
  if (rpcError) {
    console.error('[addSpotLike] RPC Error:', rpcError);
  }

  return data;
}

/**
 * スポットのいいねを削除
 */
export async function removeSpotLike(userId: string, spotId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('spot_id', spotId);

  if (error) {
    console.error('[removeSpotLike] Error:', error);
    throw error;
  }

  // user_spotsのlikes_countをデクリメント
  const { error: rpcError } = await supabase.rpc('decrement_spot_likes_count', { spot_id: spotId });
  if (rpcError) {
    console.error('[removeSpotLike] RPC Error:', rpcError);
  }
}

/**
 * スポットのいいねをトグル
 * @returns いいね後の状態（true: いいね済み, false: いいね解除）
 */
export async function toggleSpotLike(userId: string, spotId: string): Promise<boolean> {
  const isLiked = await checkSpotLiked(userId, spotId);

  if (isLiked) {
    await removeSpotLike(userId, spotId);
    return false;
  } else {
    await addSpotLike(userId, spotId);
    return true;
  }
}

/**
 * スポットのいいね数を取得
 */
export async function getSpotLikesCount(spotId: string): Promise<number> {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('spot_id', spotId);

  if (error) {
    console.error('[getSpotLikesCount] Error:', error);
    throw error;
  }

  return count ?? 0;
}

// ===============================
// マップいいね
// ===============================

/**
 * ユーザーがマップにいいねしているか確認
 */
export async function checkMapLiked(userId: string, mapId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('map_id', mapId)
    .maybeSingle();

  if (error) {
    console.error('[checkMapLiked] Error:', error);
    throw error;
  }

  return data !== null;
}

/**
 * マップにいいねを追加
 */
export async function addMapLike(userId: string, mapId: string): Promise<LikeRow> {
  const insertData: LikeInsert = {
    user_id: userId,
    map_id: mapId,
  };

  const { data, error } = await supabase
    .from('likes')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('[addMapLike] Error:', error);
    throw error;
  }

  // mapsのlikes_countをインクリメント
  await supabase.rpc('increment_map_likes_count', { map_id: mapId });

  return data;
}

/**
 * マップのいいねを削除
 */
export async function removeMapLike(userId: string, mapId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('map_id', mapId);

  if (error) {
    console.error('[removeMapLike] Error:', error);
    throw error;
  }

  // mapsのlikes_countをデクリメント
  await supabase.rpc('decrement_map_likes_count', { map_id: mapId });
}

/**
 * マップのいいねをトグル
 * @returns いいね後の状態（true: いいね済み, false: いいね解除）
 */
export async function toggleMapLike(userId: string, mapId: string): Promise<boolean> {
  const isLiked = await checkMapLiked(userId, mapId);

  if (isLiked) {
    await removeMapLike(userId, mapId);
    return false;
  } else {
    await addMapLike(userId, mapId);
    return true;
  }
}

/**
 * マップのいいね数を取得
 */
export async function getMapLikesCount(mapId: string): Promise<number> {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('map_id', mapId);

  if (error) {
    console.error('[getMapLikesCount] Error:', error);
    throw error;
  }

  return count ?? 0;
}

// ===============================
// ユーザーのいいね一覧
// ===============================

/**
 * ユーザーがいいねしたスポット一覧を取得
 */
export async function getUserLikedSpots(userId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('likes')
    .select(`
      id,
      created_at,
      user_spots (
        id,
        custom_name,
        description,
        images_count,
        likes_count,
        comments_count,
        created_at,
        master_spots (
          id,
          name,
          latitude,
          longitude,
          google_formatted_address
        ),
        users (
          id,
          username,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', userId)
    .not('spot_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getUserLikedSpots] Error:', error);
    throw error;
  }

  return (data || [])
    .filter((like: any) => like.user_spots !== null)
    .map((like: any) => ({
      likeId: like.id,
      likedAt: like.created_at,
      spot: {
        ...like.user_spots,
        master_spot: like.user_spots.master_spots,
        user: like.user_spots.users,
      },
    }));
}

/**
 * ユーザーがいいねしたマップ一覧を取得
 */
export async function getUserLikedMaps(userId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('likes')
    .select(`
      id,
      created_at,
      maps (
        id,
        name,
        description,
        is_public,
        likes_count,
        spots_count,
        created_at,
        users (
          id,
          username,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', userId)
    .not('map_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getUserLikedMaps] Error:', error);
    throw error;
  }

  return (data || [])
    .filter((like: any) => like.maps !== null)
    .map((like: any) => ({
      likeId: like.id,
      likedAt: like.created_at,
      map: {
        ...like.maps,
        user: like.maps.users,
      },
    }));
}
