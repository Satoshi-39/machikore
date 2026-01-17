/**
 * マップに属するスポット取得
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
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
      ),
      images (
        id,
        cloud_path,
        order_index
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
      // ピン刺し・現在地登録用のスポット名（JSONB形式）
      name: spot.name || null,
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
      is_liked: isLiked,
      // 画像URLの配列（imagesをorder_indexでソートしてcloud_pathを抽出）
      image_urls: (spot.images || [])
        .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .map((img: any) => img.cloud_path)
        .filter(Boolean),
    };
  });
}
