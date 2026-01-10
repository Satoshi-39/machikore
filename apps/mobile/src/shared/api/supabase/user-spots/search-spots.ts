/**
 * スポット検索
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
 */

import { supabase } from '../client';
import type { UserSpotSearchResult, MapSpotSearchResult } from './types';

/**
 * 公開スポットをキーワードで検索（RPC版）
 * 発見タブの検索で使用
 *
 * 検索対象:
 * 1. user_spots.description
 * 2. master_spots.name（Google検索経由のスポット名）
 * 3. user_spots.name（現在地/ピン刺し登録のスポット名、JSONB形式）
 */
export async function searchPublicUserSpots(
  query: string,
  limit: number = 30
): Promise<UserSpotSearchResult[]> {
  const { data, error } = await supabase.rpc('search_public_spots', {
    search_query: query,
    result_limit: limit,
  });

  if (error) {
    console.error('searchPublicUserSpots error:', error);
    return [];
  }

  // RPC結果をUserSpotSearchResult型に変換
  return (data || []).map((row: any): UserSpotSearchResult => ({
    id: row.id,
    user_id: row.user_id,
    map_id: row.map_id,
    master_spot_id: row.master_spot_id,
    machi_id: row.machi_id,
    description: row.description,
    spot_color: row.spot_color || null,
    label_id: row.label_id || null,
    map_label: row.label_name ? {
      id: row.label_id,
      name: row.label_name,
      color: row.label_color,
    } : null,
    name: row.name || null,
    images_count: row.images_count,
    likes_count: row.likes_count,
    comments_count: row.comments_count,
    order_index: row.order_index,
    created_at: row.created_at,
    updated_at: row.updated_at,
    master_spot: row.master_spot_id ? {
      id: row.master_spot_id,
      name: row.master_spot_name,
      latitude: row.master_spot_latitude,
      longitude: row.master_spot_longitude,
      google_place_id: row.master_spot_google_place_id,
      google_formatted_address: row.master_spot_google_formatted_address,
      google_short_address: row.master_spot_google_short_address,
      google_types: row.master_spot_google_types,
    } : null,
    user: row.user_username ? {
      id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      avatar_url: row.user_avatar_url,
    } : null,
    map: row.map_name ? { id: row.map_id, name: row.map_name } : null,
  }));
}

/**
 * 指定マップ内のスポットをキーワードで検索
 * other-map-searchで使用
 */
export async function searchSpotsByMapId(
  mapId: string,
  query: string,
  limit: number = 30
): Promise<MapSpotSearchResult[]> {
  // 1. user_spotsのdescriptionで検索
  const { data: descriptionResults } = await supabase
    .from('user_spots')
    .select(`
      id,
      description,
      master_spots (
        name,
        latitude,
        longitude,
        google_short_address
      )
    `)
    .eq('map_id', mapId)
    .ilike('description', `%${query}%`)
    .limit(limit);

  // 2. master_spotsの名前で検索
  const { data: masterNameResults } = await supabase
    .from('user_spots')
    .select(`
      id,
      description,
      master_spots!inner (
        name,
        latitude,
        longitude,
        google_short_address
      )
    `)
    .eq('map_id', mapId)
    .ilike('master_spots.name', `%${query}%`)
    .limit(limit);

  // 結果をマージ（重複排除）
  const resultMap = new Map<string, MapSpotSearchResult>();

  const processSpot = (spot: any) => {
    const masterSpot = spot.master_spots;
    if (masterSpot && !resultMap.has(spot.id)) {
      resultMap.set(spot.id, {
        id: spot.id,
        name: spot.description || masterSpot.name,
        address: masterSpot.google_short_address,
        latitude: masterSpot.latitude,
        longitude: masterSpot.longitude,
      });
    }
  };

  (descriptionResults || []).forEach(processSpot);
  (masterNameResults || []).forEach(processSpot);

  return Array.from(resultMap.values()).slice(0, limit);
}
