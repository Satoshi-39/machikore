/**
 * Google Geocoding API - Reverse Geocoding
 *
 * 座標から住所を取得する
 * https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding
 */

import { log } from '@/shared/config/logger';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * Reverse Geocoding レスポンス型
 */
interface ReverseGeocodeResult {
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  place_id: string;
  types: string[];
}

interface ReverseGeocodeResponse {
  results: ReverseGeocodeResult[];
  status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
  error_message?: string;
}

/**
 * address_componentsから短縮住所を生成
 * Google Places APIと同じ形式: 都道府県 + 市区町村 + 地域名
 * 例: 「東京都千代田区丸の内」
 */
function buildShortAddress(addressComponents: ReverseGeocodeResult['address_components']): string | null {
  const getComponent = (type: string) =>
    addressComponents.find((c) => c.types.includes(type))?.long_name || '';

  // 都道府県
  const prefecture = getComponent('administrative_area_level_1');
  // 市区町村
  const city = getComponent('locality') || getComponent('administrative_area_level_2');
  // 地域名（大字・町名を優先）
  // sublocality_level_2（大字・町名）を優先、なければsublocality_level_1、最後にsublocality
  // 例: "江崎字和井田" の場合、"江崎"（level_2）を取得したい
  const sublocality = getComponent('sublocality_level_2') || getComponent('sublocality_level_1') || getComponent('sublocality');

  // 短縮住所を構築
  const shortAddress = [prefecture, city, sublocality].filter(Boolean).join('');

  return shortAddress || null;
}

/**
 * Reverse Geocoding の結果型
 */
export interface ReverseGeocodeAddresses {
  shortAddress: string | null; // 短縮住所（表示用）
  formattedAddress: string | null; // 完全住所（コピー用）
}

/**
 * 座標から住所を取得（Reverse Geocoding）
 * @param latitude 緯度
 * @param longitude 経度
 * @param languageCode 言語コード（デフォルト: 'ja'）
 * @returns 短縮住所と完全住所のオブジェクト、取得できない場合はnull
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
  languageCode: string = 'ja'
): Promise<ReverseGeocodeAddresses | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    log.error('[SearchPlaces] Google API key is not configured');
    return null;
  }

  try {
    const url = `${GEOCODING_URL}?latlng=${latitude},${longitude}&language=${languageCode}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      log.error(`[SearchPlaces] HTTP error: ${response.status}`);
      return null;
    }

    const data: ReverseGeocodeResponse = await response.json();

    if (data.status !== 'OK') {
      log.error(`[SearchPlaces] API error: ${data.status}`, data.error_message);
      return null;
    }

    if (data.results.length === 0) {
      log.warn('[SearchPlaces] No results found');
      return null;
    }

    const firstResult = data.results[0];
    if (!firstResult) return null;

    // address_componentsから短縮住所を生成（Google Places APIと同じ形式）
    const shortAddress = buildShortAddress(firstResult.address_components);

    return {
      shortAddress,
      formattedAddress: firstResult.formatted_address || null,
    };
  } catch (error) {
    log.error('[SearchPlaces] Error:', error);
    return null;
  }
}

/**
 * 座標から詳細な住所情報を取得
 * @param latitude 緯度
 * @param longitude 経度
 * @param languageCode 言語コード（デフォルト: 'ja'）
 * @returns 詳細な住所情報、取得できない場合はnull
 */
export async function reverseGeocodeDetailed(
  latitude: number,
  longitude: number,
  languageCode: string = 'ja'
): Promise<ReverseGeocodeResult | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    log.error('[SearchPlaces] Google API key is not configured');
    return null;
  }

  try {
    const url = `${GEOCODING_URL}?latlng=${latitude},${longitude}&language=${languageCode}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      log.error(`[SearchPlaces] HTTP error: ${response.status}`);
      return null;
    }

    const data: ReverseGeocodeResponse = await response.json();

    if (data.status !== 'OK') {
      log.error(`[SearchPlaces] API error: ${data.status}`, data.error_message);
      return null;
    }

    if (data.results.length === 0) {
      log.warn('[SearchPlaces] No results found');
      return null;
    }

    // 最初の結果を返す
    const firstResult = data.results[0];
    return firstResult ?? null;
  } catch (error) {
    log.error('[SearchPlaces] Error:', error);
    return null;
  }
}
