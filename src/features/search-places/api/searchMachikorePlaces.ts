/**
 * 街コレデータ検索API
 * machis + user_spots (master_spots JOIN) + cities + prefectures を検索
 */

import { queryAll } from '@/shared/api/sqlite/client';
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
 * user_spots (+ master_spots) を検索
 */
function searchSpots(
  query: string,
  userId: string | null | undefined,
  includeAllSpots: boolean,
  limit: number
): MachikorePlaceSearchResult[] {
  let sql = `
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
  `;

  const params: any[] = [`%${query}%`, `%${query}%`];

  // ユーザーIDが指定されている場合、そのユーザーのspotsのみ
  if (userId && !includeAllSpots) {
    sql += ` AND s.user_id = ?`;
    params.push(userId);
  }

  sql += ` ORDER BY name LIMIT ?;`;
  params.push(limit);

  const spots = queryAll<{
    id: string;
    user_id: string;
    map_id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string | null;
  }>(sql, params);

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

  // 全カテゴリを並行検索
  const [prefResults, cityResults, machiResults, spotResults] = await Promise.all([
    Promise.resolve(searchPrefectures(trimmedQuery, prefLimit)),
    Promise.resolve(searchCities(trimmedQuery, cityLimit)),
    Promise.resolve(searchMachis(trimmedQuery, machiLimit)),
    Promise.resolve(searchSpots(trimmedQuery, userId, includeAllSpots, spotLimit)),
  ]);

  // 結果をマージしてlimit件まで返す（優先順: 都道府県 → 市区 → 街 → スポット）
  return [...prefResults, ...cityResults, ...machiResults, ...spotResults].slice(0, limit);
}
