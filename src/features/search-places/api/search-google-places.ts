/**
 * Google Places API検索
 *
 * 検索クエリから場所の候補リストを取得（Autocomplete + Place Details）
 */

import type {
  GooglePlacesAutocompleteResponse,
  PlacesSearchOptions,
} from './google-places.types';
import { fetchPlaceDetails } from './google-place-details';
import { convertToPlaceResult, type PlaceSearchResult } from '../model/types';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';

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
