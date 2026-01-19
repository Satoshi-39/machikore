/**
 * 街（machi）データ取得API
 */

import { supabase, handleSupabaseError } from '../client';
import type { MachiRow } from './types';

/**
 * 位置情報から最寄りの街を取得
 *
 * 緯度経度の範囲で絞り込んでから距離計算することで効率化
 * 範囲内で見つからない場合は段階的に範囲を広げる
 */
export async function getNearbyMachi(
  latitude: number,
  longitude: number,
  limit: number = 1
): Promise<MachiRow[]> {
  // 検索範囲（度）: 0.1度 ≒ 約11km
  const searchRanges = [0.1, 0.3, 0.5, 1.0];

  for (const range of searchRanges) {
    const { data, error } = await supabase
      .from('machi')
      .select('*')
      .gte('latitude', latitude - range)
      .lte('latitude', latitude + range)
      .gte('longitude', longitude - range)
      .lte('longitude', longitude + range);

    if (error) {
      handleSupabaseError('getNearbyMachi', error);
    }

    if (data && data.length > 0) {
      // 範囲内で見つかったらクライアント側で距離計算してソート
      // 座標がnullのデータは除外
      const validData = data.filter(
        (machi) => machi.latitude != null && machi.longitude != null
      );
      const sorted = validData
        .map((machi) => ({
          ...machi,
          distance:
            Math.abs(machi.latitude! - latitude) +
            Math.abs(machi.longitude! - longitude),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);

      return sorted;
    }
  }

  // どの範囲でも見つからない場合は空配列
  return [];
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
export async function getMachiByPrefectureId(
  prefectureId: string
): Promise<MachiRow[]> {
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
