/**
 * 単一スポット取得
 */

import { supabase, handleSupabaseError } from '../client';
import type { SpotWithDetails } from '@/shared/types';
import type { UserSpotWithMasterSpot } from './types';

/**
 * IDでスポットを取得（master_spotを結合）
 */
export async function getSpotById(spotId: string): Promise<UserSpotWithMasterSpot | null> {
  const { data, error } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*)
    `)
    .eq('id', spotId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getSpotById', error);
  }

  return {
    ...data,
    master_spot: (data as any).master_spots || null,
  };
}

/**
 * IDでスポットを詳細情報付きで取得（user, master_spot, is_liked含む）
 */
export async function getSpotWithDetails(
  spotId: string,
  currentUserId?: string | null
): Promise<SpotWithDetails | null> {
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
      maps (
        id,
        name
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('id', spotId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getSpotWithDetails', error);
  }

  const spot = data as any;
  const isLiked = currentUserId
    ? (spot.likes || []).some((like: any) => like.user_id === currentUserId)
    : false;

  return {
    id: spot.id,
    user_id: spot.user_id,
    map_id: spot.map_id,
    master_spot_id: spot.master_spot_id,
    machi_id: spot.machi_id,
    description: spot.description,
    spot_color: spot.spot_color,
    label_id: spot.label_id || null,
    map_label: spot.map_labels || null,
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
    map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
    is_liked: isLiked,
    article_content: spot.article_content || null,
  };
}
