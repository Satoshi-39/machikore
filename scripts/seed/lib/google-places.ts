/**
 * Google Places API (New) Text Search ラッパー
 *
 * スポットのクエリからGoogle Place情報を取得する
 */

export interface PlaceResult {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  shortAddress: string | null;
  location: { latitude: number; longitude: number };
  types: string[];
  rating: number | null;
  userRatingCount: number | null;
  addressComponents: AddressComponent[];
}

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

interface TextSearchResponse {
  places?: Array<{
    id: string;
    displayName: { text: string; languageCode: string };
    formattedAddress: string;
    location: { latitude: number; longitude: number };
    types: string[];
    rating?: number;
    userRatingCount?: number;
    addressComponents?: AddressComponent[];
  }>;
}

function getApiKey(): string {
  const key =
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!key) {
    throw new Error(
      "環境変数 GOOGLE_PLACES_API_KEY または EXPO_PUBLIC_GOOGLE_PLACES_API_KEY が必要です"
    );
  }
  return key;
}

function buildShortAddress(
  addressComponents: AddressComponent[]
): string | null {
  const getComponent = (type: string) =>
    addressComponents.find((c) => c.types?.includes(type))?.longText || "";

  const prefecture = getComponent("administrative_area_level_1");
  const city =
    getComponent("locality") || getComponent("administrative_area_level_2");
  const sublocality =
    getComponent("sublocality_level_2") ||
    getComponent("sublocality_level_1") ||
    getComponent("sublocality");

  const shortAddress = [prefecture, city, sublocality].filter(Boolean).join("");
  return shortAddress || null;
}

/**
 * Google Places Text Search (New API) でスポットを検索
 */
export async function searchPlace(query: string): Promise<PlaceResult | null> {
  const apiKey = getApiKey();

  const fieldMask = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.types",
    "places.rating",
    "places.userRatingCount",
    "places.addressComponents",
  ].join(",");

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "ja",
        maxResultCount: 1,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[GooglePlaces] Text Search エラー: ${errorBody}`);
    throw new Error(`Text Search error: ${response.status}`);
  }

  const data: TextSearchResponse = await response.json();

  if (!data.places || data.places.length === 0) {
    console.warn(`[GooglePlaces] "${query}" の検索結果なし`);
    return null;
  }

  const place = data.places[0];
  const addressComponents = place.addressComponents || [];

  return {
    placeId: place.id,
    displayName: place.displayName.text,
    formattedAddress: place.formattedAddress,
    shortAddress: buildShortAddress(addressComponents),
    location: place.location,
    types: place.types || [],
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount ?? null,
    addressComponents,
  };
}

/**
 * AddressComponentsから都道府県名を取得
 */
export function extractPrefectureName(
  addressComponents: AddressComponent[]
): string | null {
  const comp = addressComponents.find((c) =>
    c.types?.includes("administrative_area_level_1")
  );
  return comp?.longText ?? null;
}

/**
 * AddressComponentsから市区町村名を取得
 */
export function extractCityName(
  addressComponents: AddressComponent[]
): string | null {
  const comp = addressComponents.find(
    (c) => c.types?.includes("locality") || c.types?.includes("administrative_area_level_2")
  );
  return comp?.longText ?? null;
}
