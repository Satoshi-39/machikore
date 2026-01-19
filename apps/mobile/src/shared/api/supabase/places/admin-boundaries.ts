/**
 * 行政区域（Admin Boundaries）判定API
 * PostGIS RPC関数を使用した座標からの行政区画判定
 */

import { supabase, handleSupabaseError } from '../client';
import type { AdminBoundaryResult, MachiRow, SpotLocationInfo } from './types';
import { getCityById } from './cities';

/**
 * 座標から行政区画を判定（PostGIS RPC関数を使用）
 * prefecture_id と city_id を直接返す
 */
export async function getCityByCoordinate(
  longitude: number,
  latitude: number
): Promise<AdminBoundaryResult | null> {
  const { data, error } = await supabase.rpc('get_city_by_coordinate', {
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
  const cleaned = placeName.replace(/[丁目番号町字大字]/g, '').trim();

  return cleaned ? [cleaned] : [];
}

/**
 * スポット登録時に座標から都道府県・市区町村を特定
 *
 * PostGIS RPC関数を使用して座標から行政区画を判定
 * machi_idは後で一括更新するため、ここでは返さない
 */
export async function getSpotLocationInfo(
  latitude: number,
  longitude: number
): Promise<SpotLocationInfo> {
  // PostGISで行政区画を判定
  const adminBoundary = await getCityByCoordinate(longitude, latitude);

  return {
    prefectureId: adminBoundary?.prefecture_id ?? null,
    cityId: adminBoundary?.city_id ?? null,
  };
}

/**
 * スポット登録時に適切なmachiを特定
 * @deprecated getSpotLocationInfo を使用してください。machi_idは後で一括更新します。
 *
 * 処理フロー:
 * 1. PostGISで座標から行政区画を特定（city_idを直接取得）
 * 2. その市区町村内のmachiを取得
 * 3. 住所文字列から地名を抽出し、machiと照合
 * 4. 住所マッチングで見つからない場合、距離ベースで最寄りを選択
 * 5. 市区町村が特定できない場合はnullを返す（誤った街に紐づけるリスクを避ける）
 */
export async function findMachiForSpot(
  latitude: number,
  longitude: number,
  formattedAddress?: string
): Promise<MachiRow | null> {
  // 1. PostGISで行政区画を判定（city_idを直接取得）
  const adminBoundary = await getCityByCoordinate(longitude, latitude);

  if (!adminBoundary?.city_id) {
    // 市区町村が見つからない場合はnullを返す
    return null;
  }

  // 2. その市区町村内のmachiを取得
  const { data: machiInCity, error: machiError } = await supabase
    .from('machi')
    .select('*')
    .eq('city_id', adminBoundary.city_id);

  if (machiError) {
    handleSupabaseError('findMachiForSpot:machiInCity', machiError);
  }

  if (!machiInCity || machiInCity.length === 0) {
    return null;
  }

  // 3. 住所から地名を抽出してマッチング（優先）
  if (formattedAddress) {
    // city_id から市区町村名を取得
    const city = await getCityById(adminBoundary.city_id);
    if (city) {
      const placeNames = extractPlaceNamesFromAddress(
        formattedAddress,
        city.name
      );

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
  }

  // 4. 住所マッチングで見つからない場合は距離ベースで最寄りを選択
  // 座標がnullのデータは除外
  const validMachi = machiInCity.filter(
    (machi) => machi.latitude != null && machi.longitude != null
  );
  const sorted = validMachi
    .map((machi) => ({
      ...machi,
      distance:
        Math.abs(machi.latitude! - latitude) +
        Math.abs(machi.longitude! - longitude),
    }))
    .sort((a, b) => a.distance - b.distance);

  return sorted[0] ?? null;
}
