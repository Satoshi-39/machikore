/**
 * Supabase Likes API
 * いいね機能（スポット・マップ）
 * カウンターはトリガーで自動更新される
 */

import { supabase, handleSupabaseError } from './client';
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
    .eq('user_spot_id', spotId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkSpotLiked', error);
  }

  return data !== null;
}

/**
 * スポットにいいねを追加
 * likes_countはトリガーで自動更新される
 */
export async function addSpotLike(userId: string, spotId: string): Promise<LikeRow> {
  const insertData: LikeInsert = {
    user_id: userId,
    user_spot_id: spotId,
  };

  const { data, error } = await supabase
    .from('likes')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    handleSupabaseError('addSpotLike', error);
  }

  return data;
}

/**
 * スポットのいいねを削除
 * likes_countはトリガーで自動更新される
 */
export async function removeSpotLike(userId: string, spotId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('user_spot_id', spotId);

  if (error) {
    handleSupabaseError('removeSpotLike', error);
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
    .eq('user_spot_id', spotId);

  if (error) {
    handleSupabaseError('getSpotLikesCount', error);
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
    handleSupabaseError('checkMapLiked', error);
  }

  return data !== null;
}

/**
 * マップにいいねを追加
 * likes_countはトリガーで自動更新される
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
    handleSupabaseError('addMapLike', error);
  }

  return data;
}

/**
 * マップのいいねを削除
 * likes_countはトリガーで自動更新される
 */
export async function removeMapLike(userId: string, mapId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('map_id', mapId);

  if (error) {
    handleSupabaseError('removeMapLike', error);
  }
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
    handleSupabaseError('getMapLikesCount', error);
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
        user_id,
        map_id,
        master_spot_id,
        machi_id,
        custom_name,
        description,
        tags,
        images_count,
        likes_count,
        comments_count,
        order_index,
        created_at,
        updated_at,
        latitude,
        longitude,
        google_formatted_address,
        google_short_address,
        master_spots (
          id,
          name,
          latitude,
          longitude,
          google_place_id,
          google_formatted_address,
          google_short_address,
          google_types
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
    .not('user_spot_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getUserLikedSpots', error);
  }

  return (data || [])
    .filter((like: any) => like.user_spots !== null)
    .map((like: any) => ({
      likeId: like.id,
      likedAt: like.created_at,
      spot: {
        id: like.user_spots.id,
        user_id: like.user_spots.user_id,
        map_id: like.user_spots.map_id,
        master_spot_id: like.user_spots.master_spot_id,
        machi_id: like.user_spots.machi_id || '',
        custom_name: like.user_spots.custom_name,
        description: like.user_spots.description,
        tags: like.user_spots.tags,
        spot_color: like.user_spots.spot_color || null,
        images_count: like.user_spots.images_count,
        likes_count: like.user_spots.likes_count,
        bookmarks_count: like.user_spots.bookmarks_count ?? 0,
        comments_count: like.user_spots.comments_count,
        order_index: like.user_spots.order_index || 0,
        created_at: like.user_spots.created_at,
        updated_at: like.user_spots.updated_at,
        latitude: like.user_spots.latitude,
        longitude: like.user_spots.longitude,
        google_formatted_address: like.user_spots.google_formatted_address,
        google_short_address: like.user_spots.google_short_address,
        master_spot: like.user_spots.master_spots,
        user: like.user_spots.users,
        is_liked: true, // いいね一覧なので必ずtrue
      },
    }));
}

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
    handleSupabaseError('getUserLikedMaps', error);
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
