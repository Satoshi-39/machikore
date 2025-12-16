/**
 * 街コレデータ検索API
 * machis + master_spots + cities + prefectures を検索
 *
 * すべてSupabaseから直接検索（真実のソース）
 */

import { queryAll } from '@/shared/api/sqlite/client';
import { supabase } from '@/shared/api/supabase/client';
import { getRegionsData } from '@/shared/lib/utils/regions.utils';
import { getCountriesData } from '@/shared/lib/utils/countries.utils';
import { log } from '@/shared/config/logger';

export interface MachikorePlaceSearchResult {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  type: 'machi' | 'spot' | 'city' | 'prefecture' | 'region' | 'country';
  // spotの場合の追加情報
  userId?: string;
  mapId?: string;
  googleTypes?: string[] | null;
}

export interface MachikorePlaceSearchOptions {
  query: string;
  userId?: string | null; // 指定した場合、そのユーザーのspotsのみ検索
  includeAllSpots?: boolean; // trueの場合、全ユーザーのspotsを検索（デフォルトマップ用）
  limit?: number;
}

/**
 * countriesを検索（ローカルJSONから検索）
 */
function searchCountries(query: string, limit: number): MachikorePlaceSearchResult[] {
  const countries = getCountriesData();
  const lowerQuery = query.toLowerCase();

  return countries
    .filter((country) =>
      country.name.toLowerCase().includes(lowerQuery) ||
      country.name_kana.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit)
    .map((country) => ({
      id: country.id,
      name: country.name,
      address: null,
      latitude: country.latitude,
      longitude: country.longitude,
      type: 'country' as const,
    }));
}

/**
 * regionsを検索（ローカルJSONから検索）
 */
function searchRegions(query: string, limit: number): MachikorePlaceSearchResult[] {
  const regions = getRegionsData();
  const lowerQuery = query.toLowerCase();

  return regions
    .filter((region) =>
      region.name.toLowerCase().includes(lowerQuery) ||
      region.name_kana.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit)
    .map((region) => ({
      id: region.id,
      name: region.name,
      address: '日本',
      latitude: region.latitude,
      longitude: region.longitude,
      type: 'region' as const,
    }));
}

/**
 * prefecturesテーブルを検索（Supabaseから直接検索）
 */
async function searchPrefectures(query: string, limit: number): Promise<MachikorePlaceSearchResult[]> {
  const { data: prefectures, error } = await supabase
    .from('prefectures')
    .select('id, name, latitude, longitude')
    .ilike('name', `%${query}%`)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .limit(limit);

  if (error) {
    log.error('[SearchPlaces] searchPrefectures error:', error);
    return [];
  }

  return (prefectures ?? []).map((pref) => ({
    id: pref.id,
    name: pref.name,
    address: null,
    latitude: pref.latitude!,
    longitude: pref.longitude!,
    type: 'prefecture' as const,
  }));
}

/**
 * citiesテーブルを検索（Supabaseから直接検索）
 */
async function searchCities(query: string, limit: number): Promise<MachikorePlaceSearchResult[]> {
  const { data: cities, error } = await supabase
    .from('cities')
    .select('id, name, latitude, longitude, prefectures(name)')
    .ilike('name', `%${query}%`)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .limit(limit);

  if (error) {
    log.error('[SearchPlaces] searchCities error:', error);
    return [];
  }

  return (cities ?? []).map((city) => {
    // Supabaseのリレーション結果の型を処理
    const prefName = city.prefectures && typeof city.prefectures === 'object' && 'name' in city.prefectures
      ? (city.prefectures as { name: string }).name
      : null;
    return {
      id: city.id,
      name: city.name,
      address: prefName,
      latitude: city.latitude!,
      longitude: city.longitude!,
      type: 'city' as const,
    };
  });
}

/**
 * machisテーブルを検索（Supabaseから直接検索）
 */
async function searchMachis(query: string, limit: number): Promise<MachikorePlaceSearchResult[]> {
  const { data: machis, error } = await supabase
    .from('machi')
    .select('id, name, name_kana, latitude, longitude, prefecture_name, city_name')
    .or(`name.ilike.%${query}%,name_kana.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    log.error('[SearchPlaces] searchMachis error:', error);
    return [];
  }

  return (machis ?? []).map((machi) => ({
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
  const { data: spots, error } = await supabase
    .from('master_spots')
    .select('id, name, latitude, longitude, google_short_address, google_types')
    .or(`name.ilike.%${query}%,google_short_address.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    return [];
  }

  return (spots ?? []).map((spot) => ({
    id: spot.id,
    name: spot.name,
    address: spot.google_short_address,
    latitude: spot.latitude,
    longitude: spot.longitude,
    type: 'spot' as const,
    googleTypes: spot.google_types,
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
      ms.google_short_address as address
    FROM user_spots s
    JOIN master_spots ms ON s.master_spot_id = ms.id
    WHERE (COALESCE(s.custom_name, ms.name) LIKE ? OR ms.google_short_address LIKE ?)
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
 * 街コレデータを検索（countries + regions + prefectures + cities + machis + spots）
 */
export async function searchMachikorePlaces(
  options: MachikorePlaceSearchOptions
): Promise<MachikorePlaceSearchResult[]> {
  const { query, userId, includeAllSpots = false, limit = 20 } = options;

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  // 各カテゴリの取得件数を調整（国・地方・都道府県・市区は少なめ、街・スポットは多め）
  const countryLimit = Math.max(1, Math.floor(limit / 20)); // 国は最小限
  const regionLimit = Math.max(2, Math.floor(limit / 10));
  const prefLimit = Math.max(2, Math.floor(limit / 10));
  const cityLimit = Math.max(3, Math.floor(limit / 6));
  const machiLimit = Math.floor(limit / 3);
  const spotLimit = Math.floor(limit / 3);

  // 国・地方は同期的に検索（ローカルJSON）
  const countryResults = searchCountries(trimmedQuery, countryLimit);
  const regionResults = searchRegions(trimmedQuery, regionLimit);

  // 他カテゴリを並行検索（Supabaseから直接検索）
  const [prefResults, cityResults, machiResults, spotResults] = await Promise.all([
    searchPrefectures(trimmedQuery, prefLimit),
    searchCities(trimmedQuery, cityLimit),
    searchMachis(trimmedQuery, machiLimit),
    includeAllSpots
      ? searchMasterSpots(trimmedQuery, spotLimit)
      : userId
        ? Promise.resolve(searchUserSpots(trimmedQuery, userId, spotLimit))
        : Promise.resolve([]),
  ]);

  // 結果をマージ
  const allResults = [...countryResults, ...regionResults, ...prefResults, ...cityResults, ...machiResults, ...spotResults];

  // タイプ別優先度（小さいほど優先）
  const typePriority: Record<string, number> = {
    country: 0, // 国（最優先）
    region: 1, // 地方
    prefecture: 2, // 都道府県
    city: 3, // 市区
    machi: 4, // 街
    spot: 5, // スポット（最後に表示）
  };

  // 優先度順にソートしてlimit件まで返す
  return allResults
    .sort((a, b) => {
      const priorityDiff = (typePriority[a.type] ?? 99) - (typePriority[b.type] ?? 99);
      if (priorityDiff !== 0) return priorityDiff;
      // 同じタイプの場合は名前順
      return a.name.localeCompare(b.name, 'ja');
    })
    .slice(0, limit);
}
