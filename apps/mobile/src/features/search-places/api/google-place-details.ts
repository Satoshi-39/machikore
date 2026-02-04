/**
 * Google Place Details API 共通関数
 *
 * autocomplete.tsから利用
 */

import type { GooglePlaceDetails } from './google-places.types';
import { log } from '@/shared/config/logger';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places';

/**
 * Place IDから詳細情報を取得
 */
export async function fetchPlaceDetails(
  placeId: string,
  languageCode: string = 'ja',
  sessionToken?: string
): Promise<GooglePlaceDetails> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured');
  }

  // 取得するフィールドを指定（料金最適化のため）
  const fields = [
    'id',
    'displayName',
    'formattedAddress',
    'location',
    'types',
    'addressComponents',
  ].join(',');

  // sessionTokenがある場合はURLパラメータに追加（セッション終了）
  let url = `${PLACE_DETAILS_URL}/${placeId}?fields=${fields}&languageCode=${languageCode}`;
  if (sessionToken) {
    url += `&sessionToken=${sessionToken}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    log.error(`[SearchPlaces] Place Details エラー (${placeId}):`, errorBody);
    throw new Error(`Place Details error: ${response.status}`);
  }

  return await response.json();
}
