/**
 * 市区町村（cities）データ取得API
 */

import { supabase, handleSupabaseError } from '../client';
import type { CityRow } from './types';

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
export async function getCitiesByPrefectureId(
  prefectureId: string
): Promise<CityRow[]> {
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
 * 境界範囲内の市区町村データを取得
 */
export async function getCitiesByBounds(bounds: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}): Promise<CityRow[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .gte('latitude', bounds.minLat)
    .lte('latitude', bounds.maxLat)
    .gte('longitude', bounds.minLng)
    .lte('longitude', bounds.maxLng);

  if (error) {
    handleSupabaseError('getCitiesByBounds', error);
  }

  return data || [];
}
