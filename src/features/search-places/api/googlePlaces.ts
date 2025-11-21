/**
 * Google Places API (New)
 * https://developers.google.com/maps/documentation/places/web-service/op-overview
 */

import { ENV } from '@/shared/config';
import type {
  GooglePlacesAutocompleteResponse,
  GooglePlaceDetails,
  PlacesSearchOptions,
  PlaceSearchResult,
  GooglePlaceAutocomplete,
} from './types';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

// Google Places API (New) のエンドポイント
const AUTOCOMPLETE_URL =
  'https://places.googleapis.com/v1/places:autocomplete';
const PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places';

/**
 * Google Places Autocomplete APIで場所を検索
 *
 * 2段階で検索:
 * 1. Autocomplete API で候補リスト + Place IDを取得
 * 2. 各Place IDに対してPlace Details APIで詳細情報（座標含む）を取得
 */
export async function searchPlaces(
  options: PlacesSearchOptions
): Promise<PlaceSearchResult[]> {
  const {
    query,
    locationBias,
    languageCode = 'ja',
    includedRegionCodes = ['jp'],
    sessionToken,
  } = options;

  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured');
  }

  try {
    // Step 1: Autocomplete APIで候補を取得
    console.log(`🔍 [Google Places] "${query}" を検索中...`);

    const autocompleteBody = {
      input: query,
      languageCode,
      includedRegionCodes,
      ...(locationBias && { locationBias }),
      ...(sessionToken && { sessionToken }), // Autocomplete Sessionトークン
    };

    const autocompleteResponse = await fetch(AUTOCOMPLETE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      },
      body: JSON.stringify(autocompleteBody),
    });

    if (!autocompleteResponse.ok) {
      const errorBody = await autocompleteResponse.text();
      console.error('❌ [Google Places Autocomplete] エラー:', errorBody);
      throw new Error(
        `Google Places Autocomplete error: ${autocompleteResponse.status}`
      );
    }

    const autocompleteData: GooglePlacesAutocompleteResponse =
      await autocompleteResponse.json();

    console.log(
      `📊 [Google Places] ${autocompleteData.suggestions?.length || 0}件の候補を取得`
    );

    // Step 2: 各Place IDの詳細情報を取得
    if (!autocompleteData.suggestions || autocompleteData.suggestions.length === 0) {
      return [];
    }

    // 並列でPlace Detailsを取得（最大10件）
    const detailsPromises = autocompleteData.suggestions
      .slice(0, 10)
      .map((suggestion) =>
        fetchPlaceDetails(suggestion.placePrediction.placeId, languageCode, sessionToken)
      );

    const detailsResults = await Promise.allSettled(detailsPromises);

    // 成功した結果のみをPlaceSearchResultに変換
    const places: PlaceSearchResult[] = [];

    for (const result of detailsResults) {
      if (result.status === 'fulfilled' && result.value) {
        places.push(convertToPlaceResult(result.value));
      } else if (result.status === 'rejected') {
        console.warn('Place Details取得失敗:', result.reason);
      }
    }

    console.log(`✅ [Google Places] ${places.length}件の詳細情報を取得完了`);

    return places;
  } catch (error) {
    console.error('❌ Google Places検索エラー:', error);
    throw error;
  }
}

/**
 * Place IDから詳細情報を取得
 */
async function fetchPlaceDetails(
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
    'internationalPhoneNumber',
    'nationalPhoneNumber',
    'websiteUri',
    'rating',
    'userRatingCount',
    'googleMapsUri',
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
    console.error(`❌ [Place Details] エラー (${placeId}):`, errorBody);
    throw new Error(`Place Details error: ${response.status}`);
  }

  return await response.json();
}

/**
 * Google Place DetailsをアプリのPlaceSearchResultに変換
 */
function convertToPlaceResult(details: GooglePlaceDetails): PlaceSearchResult {
  return {
    id: details.id,
    name: details.displayName.text,
    address: details.formattedAddress || null,
    latitude: details.location.latitude,
    longitude: details.location.longitude,
    category: details.types || [],
    googleData: {
      placeId: details.id,
      placeName: details.displayName.text,
      category: details.types || [],
      address: details.formattedAddress || null,
      formattedAddress: details.formattedAddress,
      internationalPhoneNumber: details.internationalPhoneNumber,
      websiteUri: details.websiteUri,
      rating: details.rating,
      userRatingCount: details.userRatingCount,
    },
  };
}
