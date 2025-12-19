/**
 * スポット検索
 */

import { supabase } from '../client';
import type { UserSpotSearchResult, MapSpotSearchResult } from './types';

/**
 * 公開スポットをキーワードで検索（Supabase版）
 * 発見タブの検索で使用
 *
 * 検索対象:
 * 1. user_spots.custom_name, user_spots.description
 * 2. master_spots.name（スポット名）
 */
export async function searchPublicUserSpots(
  query: string,
  limit: number = 30
): Promise<UserSpotSearchResult[]> {
  // 1. user_spotsのcustom_name, descriptionで検索
  const { data: userSpotResults } = await supabase
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
      )
    `)
    .eq('maps.is_public', true)
    .or(`custom_name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  // 2. master_spotsの名前で検索し、紐づくuser_spotsを取得
  const { data: masterSpotResults } = await supabase
    .from('master_spots')
    .select(`
      id,
      name,
      latitude,
      longitude,
      google_formatted_address,
      google_short_address,
      user_spots (
        *,
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
        )
      )
    `)
    .ilike('name', `%${query}%`)
    .limit(limit);

  // 結果をマージ（重複排除）
  const resultMap = new Map<string, UserSpotSearchResult>();

  // user_spotsの結果を追加
  (userSpotResults || []).forEach((spot: any) => {
    resultMap.set(spot.id, {
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
      map: spot.maps ? { id: spot.maps.id, name: spot.maps.name, theme_color: spot.maps.theme_color } : null,
    });
  });

  // master_spotsからのuser_spotsを追加（公開マップのみ）
  (masterSpotResults || []).forEach((masterSpot: any) => {
    const userSpots = masterSpot.user_spots || [];
    userSpots.forEach((spot: any) => {
      // 公開マップのスポットのみ、かつ重複排除
      if (spot.maps?.is_public && !resultMap.has(spot.id)) {
        resultMap.set(spot.id, {
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
          master_spot: {
            id: masterSpot.id,
            name: masterSpot.name,
            latitude: masterSpot.latitude,
            longitude: masterSpot.longitude,
            google_place_id: masterSpot.google_place_id,
            google_formatted_address: masterSpot.google_formatted_address,
            google_short_address: masterSpot.google_short_address,
            google_types: masterSpot.google_types,
          },
          user: spot.users || null,
          map: spot.maps ? { id: spot.maps.id, name: spot.maps.name, theme_color: spot.maps.theme_color } : null,
        });
      }
    });
  });

  // 新着順にソートしてlimit件まで返す
  return Array.from(resultMap.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
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
  // 1. user_spotsのcustom_nameで検索
  const { data: customNameResults } = await supabase
    .from('user_spots')
    .select(`
      id,
      custom_name,
      master_spots (
        name,
        latitude,
        longitude,
        google_short_address
      )
    `)
    .eq('map_id', mapId)
    .ilike('custom_name', `%${query}%`)
    .limit(limit);

  // 2. master_spotsの名前で検索
  const { data: masterNameResults } = await supabase
    .from('user_spots')
    .select(`
      id,
      custom_name,
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
        name: spot.custom_name || masterSpot.name,
        address: masterSpot.google_short_address,
        latitude: masterSpot.latitude,
        longitude: masterSpot.longitude,
      });
    }
  };

  (customNameResults || []).forEach(processSpot);
  (masterNameResults || []).forEach(processSpot);

  return Array.from(resultMap.values()).slice(0, limit);
}
