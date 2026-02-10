/**
 * マップに属するスポット取得
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
 */

import { supabase, handleSupabaseError } from '../client';
import type { SpotWithDetails } from '@/shared/types';

/**
 * スポット取得用のSELECT文（共通化）
 */
const SPOTS_SELECT = `
  *,
  master_spots (*),
  users (
    id,
    username,
    display_name,
    avatar_url,
    avatar_crop
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
  bookmarks (
    id,
    user_id
  ),
  images!images_user_spot_id_fkey (
    id,
    cloud_path,
    order_index
  ),
  spot_tags (
    tags (
      id,
      name,
      slug
    )
  )
`;

/**
 * スポットデータをSpotWithDetails型に変換
 */
function mapSpotToDetails(spot: any, currentUserId?: string | null): SpotWithDetails {
  const isLiked = currentUserId
    ? (spot.likes || []).some((like: any) => like.user_id === currentUserId)
    : false;
  const isBookmarked = currentUserId
    ? (spot.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
    : false;

  // 画像をorder_indexでソート（thumbnail_url解決にも使用）
  const sortedImages = (spot.images || [])
    .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));
  // サムネイル画像: thumbnail_image_idがあればそのIDの画像、なければ先頭画像
  const thumbnailImage = spot.thumbnail_image_id
    ? sortedImages.find((img: any) => img.id === spot.thumbnail_image_id) || sortedImages[0]
    : sortedImages[0];

  return {
    id: spot.id,
    user_id: spot.user_id,
    map_id: spot.map_id,
    master_spot_id: spot.master_spot_id,
    machi_id: spot.machi_id,
    description: spot.description,
    article_content: spot.article_content,
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
    name: spot.name || null,
    language: spot.language || 'ja',
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
    is_bookmarked: isBookmarked,
    is_public: spot.is_public,
    image_urls: sortedImages.map((img: any) => img.cloud_path).filter(Boolean),
    // タグ情報（spot_tagsからタグを抽出）
    tags: (spot.spot_tags || [])
      .map((st: any) => st.tags)
      .filter(Boolean),
    thumbnail_image_id: spot.thumbnail_image_id || null,
    thumbnail_crop: spot.thumbnail_crop || null,
    thumbnail_url: thumbnailImage?.cloud_path || null,
  };
}

/**
 * マップに属するスポット一覧を取得（オーナー用：全スポット）
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export async function getMapSpots(
  mapId: string,
  currentUserId?: string | null
): Promise<SpotWithDetails[]> {
  const { data, error } = await supabase
    .from('user_spots')
    .select(SPOTS_SELECT)
    .eq('map_id', mapId)
    .order('order_index', { ascending: true });

  if (error) {
    handleSupabaseError('getMapSpots', error);
  }

  return (data || []).map((spot: any) => mapSpotToDetails(spot, currentUserId));
}

/**
 * マップに属する公開スポット一覧を取得（他ユーザー用：公開スポットのみ）
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export async function getPublicMapSpots(
  mapId: string,
  currentUserId?: string | null
): Promise<SpotWithDetails[]> {
  const { data, error } = await supabase
    .from('user_spots')
    .select(SPOTS_SELECT)
    .eq('map_id', mapId)
    .eq('is_public', true)
    .order('order_index', { ascending: true });

  if (error) {
    handleSupabaseError('getPublicMapSpots', error);
  }

  return (data || []).map((spot: any) => mapSpotToDetails(spot, currentUserId));
}

/**
 * マップの公開スポット数を取得（カウントのみ）
 */
export async function getPublicSpotsCount(mapId: string): Promise<number> {
  const { count, error } = await supabase
    .from('user_spots')
    .select('*', { count: 'exact', head: true })
    .eq('map_id', mapId)
    .eq('is_public', true);

  if (error) {
    handleSupabaseError('getPublicSpotsCount', error);
  }

  return count ?? 0;
}
