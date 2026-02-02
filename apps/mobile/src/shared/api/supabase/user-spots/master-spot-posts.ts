/**
 * master_spot関連のユーザー投稿取得
 */

import { supabase, handleSupabaseError } from '../client';
import type { SpotWithDetails } from '@/shared/types';

/**
 * master_spot_idに紐づく公開ユーザー投稿を取得
 */
export async function getUserSpotsByMasterSpotId(
  masterSpotId: string,
  limit: number = 20
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
        is_public
      ),
      spot_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('master_spot_id', masterSpotId)
    .eq('maps.is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getUserSpotsByMasterSpotId', error);
  }

  return (data || []).map((spot: any) => ({
    id: spot.id,
    user_id: spot.user_id,
    map_id: spot.map_id,
    master_spot_id: spot.master_spot_id,
    machi_id: spot.machi_id,
    description: spot.description,
    spot_color: spot.spot_color,
    // ピン刺し・現在地登録用のスポット名（JSONB形式）
    name: spot.name || null,
    images_count: spot.images_count,
    likes_count: spot.likes_count,
    bookmarks_count: spot.bookmarks_count ?? 0,
    comments_count: spot.comments_count,
    order_index: spot.order_index,
    created_at: spot.created_at,
    updated_at: spot.updated_at,
    master_spot: spot.master_spots || null,
    user: spot.users || null,
    map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
    is_public: spot.is_public,
    // タグ情報（spot_tagsからタグを抽出）
    tags: (spot.spot_tags || [])
      .map((st: any) => st.tags)
      .filter(Boolean),
    thumbnail_image_id: spot.thumbnail_image_id || null,
    thumbnail_crop: spot.thumbnail_crop || null,
  }));
}
