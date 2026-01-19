/**
 * 都道府県（prefectures）データ取得API
 */

import { supabase, handleSupabaseError } from '../client';
import type { PrefectureRow } from './types';

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

/**
 * IDで都道府県を取得
 */
export async function getPrefectureById(
  prefectureId: string
): Promise<PrefectureRow | null> {
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
