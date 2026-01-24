/**
 * スポット一覧取得
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
 * cursor方式のページネーション対応
 */

import { supabase, handleSupabaseError } from '../client';
import { FEED_PAGE_SIZE } from '@/shared/config';
import type { SpotWithDetails } from '@/shared/types';

/** 共通のスポット取得オプション */
interface FetchSpotsOptions {
  mapId?: string;
  publicOnly?: boolean;
  limit?: number;
  cursor?: string;
  currentUserId?: string | null;
  orderBy?: 'order_index' | 'created_at';
}

/** 共通のスポット取得 SELECT 句 */
const SPOTS_SELECT = `
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
    name,
    is_public
  ),
  likes (
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
 * Supabaseから取得したスポットデータをSpotWithDetails形式に変換
 */
function toSpotWithDetails(spot: any, currentUserId?: string | null): SpotWithDetails {
  const isLiked = currentUserId
    ? (spot.likes || []).some((like: any) => like.user_id === currentUserId)
    : false;
  const isBookmarked = currentUserId
    ? (spot.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
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
    is_bookmarked: isBookmarked,
    is_public: spot.is_public,
    article_content: spot.article_content || null,
    // 画像URLの配列（imagesをorder_indexでソートしてcloud_pathを抽出）
    image_urls: (spot.images || [])
      .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((img: any) => img.cloud_path)
      .filter(Boolean),
    // タグ情報（spot_tagsからタグを抽出）
    tags: (spot.spot_tags || [])
      .map((st: any) => st.tags)
      .filter(Boolean),
  };
}

/**
 * 内部共通関数：スポット一覧を取得（cursor方式ページネーション対応）
 */
async function fetchSpots(options: FetchSpotsOptions): Promise<SpotWithDetails[]> {
  const {
    mapId,
    publicOnly = false,
    limit,
    cursor,
    currentUserId,
    orderBy = 'order_index',
  } = options;

  let query = supabase
    .from('user_spots')
    .select(publicOnly ? SPOTS_SELECT.replace('maps (', 'maps!inner (') : SPOTS_SELECT);

  if (mapId) {
    query = query.eq('map_id', mapId);
  }

  if (publicOnly) {
    // 公開マップの公開スポットのみ
    query = query.eq('is_public', true).eq('maps.is_public', true);
  }

  query = query.order(orderBy, { ascending: orderBy === 'order_index' });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor && orderBy === 'created_at') {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('fetchSpots', error);
  }

  return (data || []).map((spot: any) => toSpotWithDetails(spot, currentUserId));
}

/**
 * マップIDでスポット一覧を取得
 */
export async function getSpotsByMapId(
  mapId: string,
  currentUserId?: string | null
): Promise<SpotWithDetails[]> {
  return fetchSpots({ mapId, currentUserId, orderBy: 'order_index' });
}

/**
 * 公開スポット一覧を取得（cursor方式ページネーション対応）
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 * @param currentUserId 現在のユーザーID（いいね状態取得用）
 */
export async function getPublicSpots(
  limit: number = FEED_PAGE_SIZE,
  cursor?: string,
  currentUserId?: string | null
): Promise<SpotWithDetails[]> {
  return fetchSpots({ publicOnly: true, limit, cursor, currentUserId, orderBy: 'created_at' });
}
