/**
 * Supabase Master Spots API
 * マスタースポットの取得・検索
 */

import { supabase, handleSupabaseError } from './client';

// ===============================
// 型定義
// ===============================

export interface MasterSpotDisplay {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: string | null;
  google_types: string[] | null;
  google_phone_number: string | null;
  google_website_uri: string | null;
  google_rating: number | null;
  google_user_rating_count: number | null;
  likes_count: number;
  user_spots_count: number;
}

// ===============================
// マスタースポット取得
// ===============================

/**
 * ビューポート範囲内のマスタースポットを取得（Supabase版）
 * ユーザー投稿があるマスタースポットのみ返す
 */
export async function getMasterSpotsByBounds(
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  limit: number = 500
): Promise<MasterSpotDisplay[]> {
  const { data, error } = await supabase
    .from('master_spots')
    .select(`
      id,
      name,
      latitude,
      longitude,
      google_place_id,
      google_formatted_address,
      google_types,
      google_phone_number,
      google_website_uri,
      google_rating,
      google_user_rating_count,
      likes_count,
      user_spots (id)
    `)
    .gte('latitude', minLat)
    .lte('latitude', maxLat)
    .gte('longitude', minLng)
    .lte('longitude', maxLng)
    .limit(limit);

  if (error) {
    handleSupabaseError('getMasterSpotsByBounds', error);
  }

  return (data || []).map((spot: any) => ({
    id: spot.id,
    name: spot.name,
    latitude: spot.latitude,
    longitude: spot.longitude,
    google_place_id: spot.google_place_id,
    google_formatted_address: spot.google_formatted_address,
    google_types: spot.google_types,
    google_phone_number: spot.google_phone_number,
    google_website_uri: spot.google_website_uri,
    google_rating: spot.google_rating,
    google_user_rating_count: spot.google_user_rating_count,
    likes_count: spot.likes_count ?? 0,
    user_spots_count: spot.user_spots?.length || 0,
  }));
}

/**
 * マスタースポットをIDで取得
 */
export async function getMasterSpotById(masterSpotId: string): Promise<MasterSpotDisplay | null> {
  const { data, error } = await supabase
    .from('master_spots')
    .select(`
      id,
      name,
      latitude,
      longitude,
      google_place_id,
      google_formatted_address,
      google_types,
      google_phone_number,
      google_website_uri,
      google_rating,
      google_user_rating_count,
      likes_count,
      user_spots (id)
    `)
    .eq('id', masterSpotId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('getMasterSpotById', error);
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    latitude: data.latitude,
    longitude: data.longitude,
    google_place_id: data.google_place_id,
    google_formatted_address: data.google_formatted_address,
    google_types: data.google_types,
    google_phone_number: data.google_phone_number,
    google_website_uri: data.google_website_uri,
    google_rating: data.google_rating,
    google_user_rating_count: data.google_user_rating_count,
    likes_count: data.likes_count ?? 0,
    user_spots_count: (data.user_spots as any[])?.length || 0,
  };
}

// ===============================
// マスタースポット検索
// ===============================

/**
 * マスタースポットをキーワードで検索（発見タブ用）
 */
export async function searchMasterSpots(
  query: string,
  limit: number = 30
): Promise<MasterSpotDisplay[]> {
  const { data, error } = await supabase
    .from('master_spots')
    .select(`
      id,
      name,
      latitude,
      longitude,
      google_place_id,
      google_formatted_address,
      google_types,
      google_phone_number,
      google_website_uri,
      google_rating,
      google_user_rating_count,
      likes_count,
      user_spots (id)
    `)
    .or(`name.ilike.%${query}%,google_formatted_address.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('[searchMasterSpots] Error:', error);
    return [];
  }

  return (data || []).map((spot: any) => ({
    id: spot.id,
    name: spot.name,
    latitude: spot.latitude,
    longitude: spot.longitude,
    google_place_id: spot.google_place_id,
    google_formatted_address: spot.google_formatted_address,
    google_types: spot.google_types,
    google_phone_number: spot.google_phone_number,
    google_website_uri: spot.google_website_uri,
    google_rating: spot.google_rating,
    google_user_rating_count: spot.google_user_rating_count,
    likes_count: spot.likes_count ?? 0,
    user_spots_count: spot.user_spots?.length || 0,
  }));
}
