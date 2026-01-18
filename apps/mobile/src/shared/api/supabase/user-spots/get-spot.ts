/**
 * 単一スポット取得
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
 */

import { supabase, handleSupabaseError } from '../client';
import type { SpotWithDetails } from '@/shared/types';

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
      ),
      spot_tags (
        tags (
          id,
          name,
          slug
        )
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
    // ピン刺し・現在地登録用のスポット名（JSONB形式）
    name: spot.name || null,
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
    master_spot: spot.master_spots ? {
      id: spot.master_spots.id,
      name: spot.master_spots.name,
      latitude: spot.master_spots.latitude,
      longitude: spot.master_spots.longitude,
      google_place_id: spot.master_spots.google_place_id,
      google_formatted_address: spot.master_spots.google_formatted_address,
      google_short_address: spot.master_spots.google_short_address,
      google_types: spot.master_spots.google_types,
    } : null,
    user: spot.users || null,
    map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
    is_liked: isLiked,
    is_public: spot.is_public,
    article_content: spot.article_content || null,
    // タグ情報（spot_tagsからタグを抽出）
    tags: (spot.spot_tags || [])
      .map((st: any) => st.tags)
      .filter(Boolean),
  };
}
