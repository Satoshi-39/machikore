/**
 * 場所データ取得API（Supabase）
 * machi, cities, prefectures テーブルからデータを取得
 */

import { supabase, handleSupabaseError } from './client';
import type { MachiRow, CityRow, PrefectureRow } from '@/shared/types/database.types';

// ===============================
// Machi（街）
// ===============================

/**
 * 位置情報から最寄りの街を取得
 */
export async function getNearbyMachi(
  latitude: number,
  longitude: number,
  limit: number = 1
): Promise<MachiRow[]> {
  // PostGISがないため、簡易的な距離計算でソート
  // SQLiteと同様に緯度・経度の絶対値差で近似
  const { data, error } = await supabase
    .from('machi')
    .select('*')
    .order('latitude', { ascending: true }) // 一度全件取得してクライアント側でソート
    .limit(1000); // 十分な件数を取得

  if (error) {
    handleSupabaseError('getNearbyMachi', error);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // クライアント側で距離計算してソート
  const sorted = data
    .map((machi) => ({
      ...machi,
      distance: Math.abs(machi.latitude - latitude) + Math.abs(machi.longitude - longitude),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  return sorted;
}

/**
 * IDで街を取得
 */
export async function getMachiById(machiId: string): Promise<MachiRow | null> {
  const { data, error } = await supabase
    .from('machi')
    .select('*')
    .eq('id', machiId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getMachiById', error);
  }

  return data;
}

/**
 * 都道府県IDで街データを取得
 */
export async function getMachiByPrefectureId(prefectureId: string): Promise<MachiRow[]> {
  const { data, error } = await supabase
    .from('machi')
    .select('*')
    .eq('prefecture_id', prefectureId)
    .order('name');

  if (error) {
    handleSupabaseError('getMachiByPrefectureId', error);
  }

  return data || [];
}

/**
 * 市区町村IDで街データを取得
 */
export async function getMachiByCityId(cityId: string): Promise<MachiRow[]> {
  const { data, error } = await supabase
    .from('machi')
    .select('*')
    .eq('city_id', cityId)
    .order('name');

  if (error) {
    handleSupabaseError('getMachiByCityId', error);
  }

  return data || [];
}

// ===============================
// City（市区町村）
// ===============================

/**
 * IDで市区町村を取得
 */
export async function getCityById(cityId: string): Promise<CityRow | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', cityId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getCityById', error);
  }

  return data;
}

/**
 * 都道府県IDで市区町村データを取得
 */
export async function getCitiesByPrefectureId(prefectureId: string): Promise<CityRow[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('prefecture_id', prefectureId)
    .order('name');

  if (error) {
    handleSupabaseError('getCitiesByPrefectureId', error);
  }

  return data || [];
}

/**
 * 全都道府県を取得
 */
export async function getAllPrefectures(): Promise<PrefectureRow[]> {
  const { data, error } = await supabase
    .from('prefectures')
    .select('*')
    .order('id');

  if (error) {
    handleSupabaseError('getAllPrefectures', error);
  }

  return data || [];
}

// ===============================
// Prefecture（都道府県）
// ===============================

/**
 * IDで都道府県を取得
 */
export async function getPrefectureById(prefectureId: string): Promise<PrefectureRow | null> {
  const { data, error } = await supabase
    .from('prefectures')
    .select('*')
    .eq('id', prefectureId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getPrefectureById', error);
  }

  return data;
}
