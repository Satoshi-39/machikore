/**
 * Supabase Transport Hubs API
 * 交通機関データ（駅、空港、フェリーターミナル、バスターミナル）の取得
 */

import { supabase, handleSupabaseError } from './client';

// ===============================
// 型定義
// ===============================

export type TransportHubType = 'station' | 'airport' | 'ferry_terminal' | 'bus_terminal';

export type StationSubtype = 'jr' | 'metro' | 'toei' | 'subway' | 'private';
export type AirportSubtype = 'international' | 'domestic' | 'military' | 'heliport';

export interface TransportHubRow {
  id: string;
  osm_id: number | null;
  osm_type: string | null;
  prefecture_id: string;
  city_id: string | null;
  type: TransportHubType;
  subtype: string | null;
  name: string;
  name_kana: string | null;
  name_en: string | null;
  operator: string | null;
  network: string | null;
  ref: string | null;
  latitude: number;
  longitude: number;
  country_code: string;
  created_at: string;
  updated_at: string;
}

// ===============================
// 交通機関データ取得
// ===============================

/**
 * 都道府県の交通機関データを取得
 */
export async function getTransportHubsByPrefecture(
  prefectureId: string,
  types?: TransportHubType[]
): Promise<TransportHubRow[]> {
  let query = supabase
    .from('transport_hubs')
    .select('*')
    .eq('prefecture_id', prefectureId);

  // タイプフィルタ
  if (types && types.length > 0) {
    query = query.in('type', types);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getTransportHubsByPrefecture', error);
  }

  return data || [];
}

/**
 * ビューポート範囲内の交通機関データを取得
 */
export async function getTransportHubsByBounds(
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  types?: TransportHubType[],
  limit: number = 500
): Promise<TransportHubRow[]> {
  let query = supabase
    .from('transport_hubs')
    .select('*')
    .gte('latitude', minLat)
    .lte('latitude', maxLat)
    .gte('longitude', minLng)
    .lte('longitude', maxLng)
    .limit(limit);

  // タイプフィルタ
  if (types && types.length > 0) {
    query = query.in('type', types);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getTransportHubsByBounds', error);
  }

  return data || [];
}

/**
 * 駅のみ取得（都道府県指定）
 */
export async function getStationsByPrefecture(
  prefectureId: string
): Promise<TransportHubRow[]> {
  return getTransportHubsByPrefecture(prefectureId, ['station']);
}

/**
 * 空港のみ取得（都道府県指定）
 */
export async function getAirportsByPrefecture(
  prefectureId: string
): Promise<TransportHubRow[]> {
  return getTransportHubsByPrefecture(prefectureId, ['airport']);
}
