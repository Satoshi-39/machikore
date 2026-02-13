/**
 * Google Places API検索
 *
 * 検索クエリからAutocomplete候補リストを取得
 * Place Detailsはユーザーが選択した1件のみ取得（コスト最適化）
 */

import type {
  GooglePlacesAutocompleteResponse,
  PlacesSearchOptions,
} from './google-places.types';
import type { PlaceAutocompleteSuggestion } from '../model/types';
import { log } from '@/shared/config/logger';
import { getGoogleApiPlatformHeaders } from './google-api-headers';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';

/**
 * Google Places Autocomplete APIで場所を検索
 *
 * Autocomplete APIで候補リストを取得（Place Detailsは呼ばない）
 * ユーザーが候補を選択した時のみ、別途fetchPlaceDetailsで1件取得する
 */
export async function searchPlaces(
  options: PlacesSearchOptions
): Promise<PlaceAutocompleteSuggestion[]> {
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
    log.debug(`[SearchPlaces] "${query}" を検索中...`);

    const autocompleteBody = {
      input: query,
      languageCode,
      includedRegionCodes,
      ...(locationBias && { locationBias }),
      ...(sessionToken && { sessionToken }),
    };

    const autocompleteResponse = await fetch(AUTOCOMPLETE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        ...getGoogleApiPlatformHeaders(),
      },
      body: JSON.stringify(autocompleteBody),
    });

    if (!autocompleteResponse.ok) {
      const errorBody = await autocompleteResponse.text();
      log.error('[SearchPlaces] Google Places Autocomplete エラー:', errorBody);
      throw new Error(
        `Google Places Autocomplete error: ${autocompleteResponse.status}`
      );
    }

    const autocompleteData: GooglePlacesAutocompleteResponse =
      await autocompleteResponse.json();

    log.debug(
      `[SearchPlaces] ${autocompleteData.suggestions?.length || 0}件の候補を取得`
    );

    if (!autocompleteData.suggestions || autocompleteData.suggestions.length === 0) {
      return [];
    }

    // Autocomplete結果をPlaceAutocompleteSuggestionに変換
    const suggestions: PlaceAutocompleteSuggestion[] = autocompleteData.suggestions
      .slice(0, 10)
      .map((suggestion) => ({
        placeId: suggestion.placePrediction.placeId,
        name: suggestion.placePrediction.structuredFormat.mainText.text,
        address: suggestion.placePrediction.structuredFormat.secondaryText.text,
        types: suggestion.placePrediction.types,
      }));

    log.debug(`[SearchPlaces] ${suggestions.length}件の候補を返却`);

    return suggestions;
  } catch (error) {
    log.error('[SearchPlaces] Google Places検索エラー:', error);
    throw error;
  }
}
