/**
 * マップに属するスポット取得
 */

import { supabase, handleSupabaseError } from '../client';
import type { SpotWithDetails } from '@/shared/types';

/**
 * マップに属するスポット一覧を取得
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export async function getMapSpots(
  mapId: string,
  currentUserId?: string | null
): Promise<SpotWithDetails[]> {
  const { data, error } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*),
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      map_labels (
        id,
        name,
        color
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('map_id', mapId)
    .order('order_index', { ascending: true });

  if (error) {
    handleSupabaseError('getMapSpots', error);
  }

  return (data || []).map((spot: any) => {
    // 現在のユーザーがいいねしているかチェック
    const isLiked = currentUserId
      ? (spot.likes || []).some((like: any) => like.user_id === currentUserId)
      : false;

    return {
      id: spot.id,
      user_id: spot.user_id,
      map_id: spot.map_id,
      master_spot_id: spot.master_spot_id,
      machi_id: spot.machi_id,
      custom_name: spot.custom_name,
      description: spot.description,
      article_content: spot.article_content,
      tags: spot.tags,
      images_count: spot.images_count,
      likes_count: spot.likes_count,
      bookmarks_count: spot.bookmarks_count ?? 0,
      comments_count: spot.comments_count,
      order_index: spot.order_index,
      created_at: spot.created_at,
      updated_at: spot.updated_at,
      latitude: spot.latitude,
      longitude: spot.longitude,
      google_formatted_address: spot.google_formatted_address,
      google_short_address: spot.google_short_address,
      spot_color: spot.spot_color || null,
      label_id: spot.label_id || null,
      map_label: spot.map_labels || null,
      master_spot: spot.master_spots || null,
      user: spot.users || null,
      is_liked: isLiked,
    };
  });
}
