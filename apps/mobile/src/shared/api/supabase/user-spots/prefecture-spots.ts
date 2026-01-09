/**
 * 都道府県別スポット検索
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
 */

import { supabase, handleSupabaseError } from '../client';
import type { SpotWithDetails } from '@/shared/types';

/**
 * 都道府県IDで公開スポットを検索
 * @param prefectureId 都道府県ID（prefectures.id）
 * @param currentUserId 現在のユーザーID（いいね状態取得用）
 * @param limit 取得件数
 */
export async function getPublicSpotsByPrefecture(
  prefectureId: string,
  currentUserId?: string | null,
  limit: number = 50
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
      likes (
        id,
        user_id
      )
    `)
    .eq('prefecture_id', prefectureId)
    .eq('maps.is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getPublicSpotsByPrefecture', error);
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
      description: spot.description,
      tags: spot.tags,
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
    };
  });
}

/**
 * 都道府県ID + カテゴリIDで公開スポットを検索
 * @param prefectureId 都道府県ID（prefectures.id）
 * @param categoryId カテゴリID（categories.id）
 * @param currentUserId 現在のユーザーID（いいね状態取得用）
 * @param limit 取得件数
 */
export async function getPublicSpotsByPrefectureAndCategory(
  prefectureId: string,
  categoryId: string,
  currentUserId?: string | null,
  limit: number = 50
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
        is_public,
        category_id
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('prefecture_id', prefectureId)
    .eq('maps.is_public', true)
    .eq('maps.category_id', categoryId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getPublicSpotsByPrefectureAndCategory', error);
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
      description: spot.description,
      tags: spot.tags,
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
    };
  });
}
