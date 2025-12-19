/**
 * スポット一覧取得
 */

import { supabase, handleSupabaseError } from '../client';
import type { SpotWithDetails } from '@/shared/types';
import type { UserSpotWithMasterSpot } from './types';

/**
 * マップIDでスポット一覧を取得
 */
export async function getSpotsByMapId(mapId: string): Promise<UserSpotWithMasterSpot[]> {
  const { data, error } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*)
    `)
    .eq('map_id', mapId)
    .order('order_index', { ascending: true });

  if (error) {
    handleSupabaseError('getSpotsByMapId', error);
  }

  return (data || []).map((spot: any) => ({
    ...spot,
    master_spot: spot.master_spots || null,
  }));
}

/**
 * 公開スポット一覧を取得
 */
export async function getPublicSpots(
  limit: number = 50,
  offset: number = 0,
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
      maps!inner (
        id,
        name,
        theme_color,
        is_public
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('maps.is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    handleSupabaseError('getPublicSpots', error);
  }

  return (data || []).map((spot: any) => {
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
      master_spot: spot.master_spots || null,
      user: spot.users || null,
      map: spot.maps ? { id: spot.maps.id, name: spot.maps.name, theme_color: spot.maps.theme_color } : null,
      is_liked: isLiked,
    };
  });
}
