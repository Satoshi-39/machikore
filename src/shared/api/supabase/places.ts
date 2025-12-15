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
      const sorted = data
        .map((machi) => ({
          ...machi,
          distance: Math.abs(machi.latitude - latitude) + Math.abs(machi.longitude - longitude),
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

// ===============================
// Admin Boundaries（行政区域ポリゴン）
// ===============================

interface AdminBoundaryResult {
  code: string;       // 行政区域コード（5桁）
  name: string;       // 市区町村名
  prefecture: string; // 都道府県名
  pref_code: string;  // 都道府県コード（2桁）
}

/**
 * 座標から市区町村を判定（PostGIS RPC関数を使用）
 */
export async function getCityByCoordinate(
  longitude: number,
  latitude: number
): Promise<AdminBoundaryResult | null> {
  const { data, error } = await supabase
    .rpc('get_city_by_coordinate', {
      lng: longitude,
      lat: latitude,
    });

  if (error) {
    handleSupabaseError('getCityByCoordinate', error);
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0] as AdminBoundaryResult;
}

/**
 * 都道府県名からprefecture_idを取得
 * 例: "山口県" → "yamaguchi"
 *
 * prefecturesテーブルから動的に取得
 */
async function getPrefectureIdByName(prefectureName: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('prefectures')
    .select('id')
    .eq('name', prefectureName)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.warn('getPrefectureIdByName error:', error);
    }
    return null;
  }

  return data?.id ?? null;
}

/**
 * 住所文字列から地名部分を抽出
 * 例: "山口県山口市江崎２７１０" → ["江崎"]
 * 例: "東京都渋谷区神南1丁目" → ["神南"]
 *
 * 市区町村名以降の地名を抽出する
 */
function extractPlaceNamesFromAddress(
  address: string,
  cityName: string
): string[] {
  if (!address || !cityName) return [];

  // 市区町村名の位置を探す
  const cityIndex = address.indexOf(cityName);
  if (cityIndex === -1) return [];

  // 市区町村名以降の部分を取得
  const afterCity = address.substring(cityIndex + cityName.length);
  if (!afterCity) return [];

  // 数字（番地）の前までを地名とみなす
  // 全角・半角数字の両方に対応
  const placeMatch = afterCity.match(/^([^\d０-９]+)/);
  if (!placeMatch || !placeMatch[1]) return [];

  const placeName = placeMatch[1].trim();
  if (!placeName) return [];

  // 「丁目」「番」「号」などを除去
  const cleaned = placeName
    .replace(/[丁目番号町字大字]/g, '')
    .trim();

  return cleaned ? [cleaned] : [];
}

/**
 * スポット登録時に適切なmachiを特定
 *
 * 処理フロー:
 * 1. PostGISで座標から市区町村を特定
 * 2. 住所文字列から地名を抽出し、同じ市区町村内のmachiと照合
 * 3. 住所マッチングで見つからない場合、市区町村内で座標から最寄りを選択
 * 4. 市区町村が特定できない場合はnullを返す（誤った街に紐づけるリスクを避ける）
 */
export async function findMachiForSpot(
  latitude: number,
  longitude: number,
  formattedAddress?: string
): Promise<MachiRow | null> {
  // 1. PostGISで市区町村を判定
  const adminBoundary = await getCityByCoordinate(longitude, latitude);

  if (adminBoundary) {
    // 2. 都道府県名からprefecture_idを取得（Supabaseから動的に）
    const prefectureId = await getPrefectureIdByName(adminBoundary.prefecture);

    if (!prefectureId) {
      console.warn(`findMachiForSpot: 都道府県が見つかりません: ${adminBoundary.prefecture}`);
    }

    // 3. 市区町村名でcitiesテーブルを検索してcity_idを取得
    const { data: cities, error: cityError } = await supabase
      .from('cities')
      .select('id')
      .eq('name', adminBoundary.name)
      .eq('prefecture_id', prefectureId ?? '');

    if (cityError) {
      console.warn('findMachiForSpot:cityLookup error:', cityError);
    }

    const cityId = cities?.[0]?.id;

    if (cityId) {
      // 4. その市区町村内のmachiを取得
      const { data: machiInCity, error: machiError } = await supabase
        .from('machi')
        .select('*')
        .eq('city_id', cityId);

      if (machiError) {
        handleSupabaseError('findMachiForSpot:machiInCity', machiError);
      }

      if (machiInCity && machiInCity.length > 0) {
        // 5. 住所から地名を抽出してマッチング（優先）
        if (formattedAddress) {
          const placeNames = extractPlaceNamesFromAddress(formattedAddress, adminBoundary.name);

          for (const placeName of placeNames) {
            // 完全一致を優先
            const exactMatch = machiInCity.find(
              (machi) => machi.name === placeName
            );
            if (exactMatch) {
              return exactMatch;
            }

            // 部分一致（machiの名前が地名を含む、または地名がmachiの名前を含む）
            const partialMatch = machiInCity.find(
              (machi) =>
                machi.name.includes(placeName) || placeName.includes(machi.name)
            );
            if (partialMatch) {
              return partialMatch;
            }
          }
        }

        // 6. 住所マッチングで見つからない場合は距離ベースで最寄りを選択
        const sorted = machiInCity
          .map((machi) => ({
            ...machi,
            distance: Math.abs(machi.latitude - latitude) + Math.abs(machi.longitude - longitude),
          }))
          .sort((a, b) => a.distance - b.distance);

        return sorted[0] ?? null;
      }
    }
  }

  // 7. 市区町村が見つからない or machiがない場合はnullを返す
  // （全国から最寄りを検索すると誤った街に紐づくリスクがあるため）
  return null;
}
