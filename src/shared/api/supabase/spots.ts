/**
 * Supabase Spots API
 * 公開スポットの取得など
 */

import { supabase } from './client';
import type { SpotWithDetails } from '@/shared/types';

// ===============================
// 公開スポット取得
// ===============================

/**
 * 公開スポット一覧を取得（フィード用）
 */
export async function getPublicSpots(
  limit: number = 50,
  offset: number = 0
): Promise<SpotWithDetails[]> {
  const { data, error } = await supabase
    .from('spots')
    .select(`
      *,
      master_spots (
        id,
        name,
        latitude,
        longitude,
        google_place_id,
        google_formatted_address,
        google_types
      ),
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      maps!inner (
        is_public
      )
    `)
    .eq('maps.is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Failed to fetch public spots:', error);
    throw error;
  }

  return (data || []).map((spot: any) => ({
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
    comments_count: spot.comments_count,
    order_index: spot.order_index,
    created_at: spot.created_at,
    updated_at: spot.updated_at,
    master_spot: spot.master_spots || null,
    user: spot.users || null,
  }));
}
