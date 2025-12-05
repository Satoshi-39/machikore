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
