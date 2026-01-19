/**
 * ユーザーがいいねした一覧取得
 */

import { supabase, handleSupabaseError } from '../client';

/**
 * ユーザーがいいねしたスポット一覧を取得（cursor方式ページネーション対応）
 * @param userId ユーザーID
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 */
export async function getUserLikedSpots(
  userId: string,
  limit: number = 10,
  cursor?: string
) {
  let query = supabase
    .from('likes')
    .select(`
      id,
      created_at,
      user_spot_id,
      user_spots (
        id,
        user_id,
        map_id,
        master_spot_id,
        machi_id,
        description,
        spot_color,
        images_count,
        likes_count,
        bookmarks_count,
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
        ),
        maps (
          language
        ),
        images (
          id,
          cloud_path,
          order_index
        )
      )
    `)
    .eq('user_id', userId)
    .not('user_spot_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getUserLikedSpots', error);
  }

  return (data || [])
    .filter((like: any) => like.user_spots !== null)
    .map((like: any) => {
      // 画像を order_index でソートして最初の1枚を取得
      const images = like.user_spots.images || [];
      const sortedImages = [...images].sort((a: any, b: any) => a.order_index - b.order_index);
      const firstImage = sortedImages[0] || null;

      return {
        likeId: like.id,
        likedAt: like.created_at,
        spot: {
          id: like.user_spots.id,
          user_id: like.user_spots.user_id,
          map_id: like.user_spots.map_id,
          master_spot_id: like.user_spots.master_spot_id,
          machi_id: like.user_spots.machi_id || '',
          description: like.user_spots.description,
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
          master_spot: like.user_spots.master_spots ? {
            id: like.user_spots.master_spots.id,
            name: like.user_spots.master_spots.name,
            latitude: like.user_spots.master_spots.latitude,
            longitude: like.user_spots.master_spots.longitude,
            google_place_id: like.user_spots.master_spots.google_place_id,
            google_formatted_address: like.user_spots.master_spots.google_formatted_address,
            google_short_address: like.user_spots.master_spots.google_short_address,
            google_types: like.user_spots.master_spots.google_types,
          } : null,
          user: like.user_spots.users,
          is_liked: true, // いいね一覧なので必ずtrue
          // サムネイル用の最初の画像
          thumbnail_image: firstImage ? {
            id: firstImage.id,
            cloud_path: firstImage.cloud_path,
          } : null,
        },
      };
    });
}

/**
 * ユーザーがいいねしたマップ一覧を取得（cursor方式ページネーション対応）
 * @param userId ユーザーID
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 */
export async function getUserLikedMaps(
  userId: string,
  limit: number = 10,
  cursor?: string
) {
  let query = supabase
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

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

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
