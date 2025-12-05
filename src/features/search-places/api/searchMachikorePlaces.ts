/**
 * 街コレデータ検索API
 * machis + master_spots + cities + prefectures を検索
 *
 * - 都道府県、市区、街: SQLiteから検索（マスターデータ）
 * - マスタースポット: Supabaseから検索（動的データ）
 */

import { queryAll } from '@/shared/api/sqlite/client';
import { supabase } from '@/shared/api/supabase/client';
import type { MachiRow, CityRow, PrefectureRow } from '@/shared/types/database.types';

export interface MachikorePlaceSearchResult {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  type: 'machi' | 'spot' | 'city' | 'prefecture';
  // spotの場合の追加情報
  userId?: string;
  mapId?: string;
}

export interface MachikorePlaceSearchOptions {
  query: string;
  userId?: string | null; // 指定した場合、そのユーザーのspotsのみ検索
  includeAllSpots?: boolean; // trueの場合、全ユーザーのspotsを検索（デフォルトマップ用）
  limit?: number;
}

/**
 * prefecturesテーブルを検索
 */
function searchPrefectures(query: string, limit: number): MachikorePlaceSearchResult[] {
  const prefectures = queryAll<PrefectureRow>(
    `
    SELECT * FROM prefectures
    WHERE name LIKE ? AND latitude IS NOT NULL AND longitude IS NOT NULL
    ORDER BY name
    LIMIT ?;
    `,
    [`%${query}%`, limit]
  );

  return prefectures
    .filter((pref) => pref.latitude !== null && pref.longitude !== null)
    .map((pref) => ({
      id: pref.id,
      name: pref.name,
      address: null,
      latitude: pref.latitude!,
      longitude: pref.longitude!,
      type: 'prefecture' as const,
    }));
}

/**
 * citiesテーブルを検索
 */
function searchCities(query: string, limit: number): MachikorePlaceSearchResult[] {
  const cities = queryAll<CityRow & { prefecture_name?: string }>(
    `
    SELECT c.*, p.name as prefecture_name FROM cities c
    LEFT JOIN prefectures p ON c.prefecture_id = p.id
    WHERE c.name LIKE ? AND c.latitude IS NOT NULL AND c.longitude IS NOT NULL
    ORDER BY c.name
    LIMIT ?;
    `,
    [`%${query}%`, limit]
  );

  return cities
    .filter((city) => city.latitude !== null && city.longitude !== null)
    .map((city) => ({
      id: city.id,
      name: city.name,
      address: city.prefecture_name || null,
      latitude: city.latitude!,
      longitude: city.longitude!,
      type: 'city' as const,
    }));
}

/**
 * machisテーブルを検索
 */
function searchMachis(query: string, limit: number): MachikorePlaceSearchResult[] {
  const machis = queryAll<MachiRow>(
    `
    SELECT * FROM machi
    WHERE name LIKE ? OR name_kana LIKE ?
    ORDER BY name
    LIMIT ?;
    `,
    [`%${query}%`, `%${query}%`, limit]
  );

  return machis.map((machi) => ({
    id: machi.id,
    name: machi.name,
    address: `${machi.prefecture_name}${machi.city_name || ''}`,
    latitude: machi.latitude,
    longitude: machi.longitude,
    type: 'machi' as const,
  }));
}

/**
 * master_spots を Supabase から検索（デフォルトマップ用）
 */
async function searchMasterSpots(query: string, limit: number): Promise<MachikorePlaceSearchResult[]> {
  console.log('🔍 [master_spots検索] query:', query, 'limit:', limit);

  const { data: spots, error } = await supabase
    .from('master_spots')
    .select('id, name, latitude, longitude, google_formatted_address')
    .or(`name.ilike.%${query}%,google_formatted_address.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('🔍 [master_spots検索] エラー:', error);
    return [];
  }

  console.log('🔍 [master_spots検索] 結果件数:', spots?.length ?? 0);

  return (spots ?? []).map((spot) => ({
    id: spot.id,
    name: spot.name,
    address: spot.google_formatted_address,
    latitude: spot.latitude,
    longitude: spot.longitude,
    type: 'spot' as const,
  }));
}

/**
 * user_spots (+ master_spots) を検索（ユーザーマップ用）
 */
function searchUserSpots(
  query: string,
  userId: string,
  limit: number
): MachikorePlaceSearchResult[] {
  const spots = queryAll<{
    id: string;
    user_id: string;
    map_id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string | null;
  }>(
    `
    SELECT
      s.id,
      s.user_id,
      s.map_id,
      COALESCE(s.custom_name, ms.name) as name,
      ms.latitude,
      ms.longitude,
      ms.google_formatted_address as address
    FROM user_spots s
    JOIN master_spots ms ON s.master_spot_id = ms.id
    WHERE (COALESCE(s.custom_name, ms.name) LIKE ? OR ms.google_formatted_address LIKE ?)
      AND s.user_id = ?
    ORDER BY name
    LIMIT ?;
    `,
    [`%${query}%`, `%${query}%`, userId, limit]
  );

  return spots.map((spot) => ({
    id: spot.id,
    name: spot.name,
    address: spot.address,
    latitude: spot.latitude,
    longitude: spot.longitude,
    type: 'spot' as const,
    userId: spot.user_id,
    mapId: spot.map_id,
  }));
}

/**
 * 街コレデータを検索（prefectures + cities + machis + spots）
 */
export async function searchMachikorePlaces(
  options: MachikorePlaceSearchOptions
): Promise<MachikorePlaceSearchResult[]> {
  const { query, userId, includeAllSpots = false, limit = 20 } = options;

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  // 各カテゴリの取得件数を調整（都道府県・市区は少なめ、街・スポットは多め）
  const prefLimit = Math.max(2, Math.floor(limit / 10));
  const cityLimit = Math.max(3, Math.floor(limit / 6));
  const machiLimit = Math.floor(limit / 3);
  const spotLimit = Math.floor(limit / 3);

  // 全カテゴリを並行検索（スポット検索：デフォルトマップはmaster_spots、ユーザーマップはuser_spots）
  const [prefResults, cityResults, machiResults, spotResults] = await Promise.all([
    Promise.resolve(searchPrefectures(trimmedQuery, prefLimit)),
    Promise.resolve(searchCities(trimmedQuery, cityLimit)),
    Promise.resolve(searchMachis(trimmedQuery, machiLimit)),
    includeAllSpots
      ? searchMasterSpots(trimmedQuery, spotLimit)
      : userId
        ? Promise.resolve(searchUserSpots(trimmedQuery, userId, spotLimit))
        : Promise.resolve([]),
  ]);

  // 結果をマージしてlimit件まで返す（優先順: 都道府県 → 市区 → 街 → スポット）
  return [...prefResults, ...cityResults, ...machiResults, ...spotResults].slice(0, limit);
}
