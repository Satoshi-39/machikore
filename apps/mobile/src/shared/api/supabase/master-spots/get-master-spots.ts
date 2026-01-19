/**
 * マスタースポット取得API
 */

import { supabase, handleSupabaseError } from '../client';
import type { MasterSpotDisplay } from './types';

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
    .select(
      `
      id,
      name,
      latitude,
      longitude,
      google_place_id,
      google_formatted_address,
      google_short_address,
      google_types,
      google_phone_number,
      google_website_uri,
      google_rating,
      google_user_rating_count,
      user_spots (id)
    `
    )
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
    google_short_address: spot.google_short_address,
    google_types: spot.google_types,
    google_phone_number: spot.google_phone_number,
    google_website_uri: spot.google_website_uri,
    google_rating: spot.google_rating,
    google_user_rating_count: spot.google_user_rating_count,
    user_spots_count: spot.user_spots?.length || 0,
  }));
}

/**
 * マスタースポットをIDで取得
 */
export async function getMasterSpotById(
  masterSpotId: string
): Promise<MasterSpotDisplay | null> {
  const { data, error } = await supabase
    .from('master_spots')
    .select(
      `
      id,
      name,
      latitude,
      longitude,
      google_place_id,
      google_formatted_address,
      google_short_address,
      google_types,
      google_phone_number,
      google_website_uri,
      google_rating,
      google_user_rating_count,
      user_spots (id)
    `
    )
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
    google_short_address: data.google_short_address,
    google_types: data.google_types,
    google_phone_number: data.google_phone_number,
    google_website_uri: data.google_website_uri,
    google_rating: data.google_rating,
    google_user_rating_count: data.google_user_rating_count,
    user_spots_count: (data.user_spots as any[])?.length || 0,
  };
}

/**
 * 街に属するマスタースポットを取得（お気に入り数順）
 */
export async function getMasterSpotsByMachi(
  machiId: string,
  limit: number = 20
): Promise<MasterSpotDisplay[]> {
  const { data, error } = await supabase
    .from('master_spots')
    .select(
      `
      id,
      name,
      latitude,
      longitude,
      google_place_id,
      google_formatted_address,
      google_short_address,
      google_types,
      google_phone_number,
      google_website_uri,
      google_rating,
      google_user_rating_count,
      favorites_count,
      user_spots (id)
    `
    )
    .eq('machi_id', machiId)
    .order('favorites_count', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getMasterSpotsByMachi', error);
  }

  return (data || []).map((spot: any) => ({
    id: spot.id,
    name: spot.name,
    latitude: spot.latitude,
    longitude: spot.longitude,
    google_place_id: spot.google_place_id,
    google_formatted_address: spot.google_formatted_address,
    google_short_address: spot.google_short_address,
    google_types: spot.google_types,
    google_phone_number: spot.google_phone_number,
    google_website_uri: spot.google_website_uri,
    google_rating: spot.google_rating,
    google_user_rating_count: spot.google_user_rating_count,
    user_spots_count: spot.user_spots?.length || 0,
  }));
}
