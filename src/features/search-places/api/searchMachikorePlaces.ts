/**
 * 街コレデータ検索API
 * machis + user_spots (master_spots JOIN) を検索
 */

import { queryAll } from '@/shared/api/sqlite/client';
import type { MachiRow } from '@/shared/types/database.types';

export interface MachikorePlaceSearchResult {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  type: 'machi' | 'spot';
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
 * 街コレデータを検索（machis + spots）
 */
export async function searchMachikorePlaces(
  options: MachikorePlaceSearchOptions
): Promise<MachikorePlaceSearchResult[]> {
  const { query, userId, includeAllSpots = false, limit = 20 } = options;

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  // machisとspotsを並行検索
  const [machiResults, spotResults] = await Promise.all([
    Promise.resolve(searchMachis(trimmedQuery, Math.floor(limit / 2))),
    Promise.resolve(searchSpots(trimmedQuery, userId, includeAllSpots, Math.floor(limit / 2))),
  ]);

  // 結果をマージしてlimit件まで返す
  return [...machiResults, ...spotResults].slice(0, limit);
}
