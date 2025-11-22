/**
 * Google Reverse Geocoding API
 *
 * 座標から場所情報を取得（Mapbox POIタップ時に使用）
 * コスト: $5/1000 (Reverse Geocoding) + $17/1000 (Place Details) = $22/1000
 */

import type { PlaceSearchResult } from './types';
import { fetchPlaceDetails, convertToPlaceResult } from './placeDetails';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const REVERSE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * Reverse Geocoding: 座標からPlace IDと詳細情報を取得
 *
 * @param latitude 緯度
 * @param longitude 経度
 * @returns PlaceSearchResult または null
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<PlaceSearchResult | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured');
  }

  try {
    console.log(`🔍 [Reverse Geocode] 座標から場所を検索: ${latitude}, ${longitude}`);

    // Step 1: Reverse Geocodingで Place IDを取得
    const url = `${REVERSE_GEOCODE_URL}?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}&language=ja`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ [Reverse Geocode] エラー:', errorBody);
      throw new Error(`Reverse Geocoding error: ${response.status}`);
    }

    const data = await response.json();

    // デバッグ: レスポンス内容を確認
    console.log('🔍 [Reverse Geocode Debug] status:', data.status);
    console.log('🔍 [Reverse Geocode Debug] results count:', data.results?.length);
    console.log('🔍 [Reverse Geocode Debug] full response:', JSON.stringify(data, null, 2));

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.warn('⚠️ [Reverse Geocode] 結果が見つかりません');
      return null;
    }

    // 最初の結果からPlace IDを取得（最も精度が高い）
    const result = data.results[0];
    const placeId = result.place_id;

    console.log(`📍 [Reverse Geocode] Place ID取得: ${placeId}`);

    // Step 2: Place Details APIで詳細情報を取得
    const placeDetails = await fetchPlaceDetails(placeId, 'ja');

    console.log(`✅ [Reverse Geocode] 詳細情報取得完了: ${placeDetails.displayName.text}`);

    return convertToPlaceResult(placeDetails);
  } catch (error) {
    console.error('❌ Reverse Geocoding エラー:', error);
    throw error;
  }
}
