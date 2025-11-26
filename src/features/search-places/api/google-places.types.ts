/**
 * Google Places API (New) 型定義
 * https://developers.google.com/maps/documentation/places/web-service/op-overview
 *
 * 外部APIのレスポンス型のみを定義（アプリ内部型はmodel/types.tsに分離）
 */

/**
 * Google Places Autocomplete Prediction
 */
export interface GooglePlaceAutocomplete {
  placePrediction: {
    place: string; // Place ID
    placeId: string;
    text: {
      text: string; // 表示テキスト
      matches: Array<{ endOffset: number }>;
    };
    structuredFormat: {
      mainText: {
        text: string; // メインテキスト（施設名など）
        matches: Array<{ endOffset: number }>;
      };
      secondaryText: {
        text: string; // サブテキスト（住所など）
      };
    };
    types: string[]; // ["restaurant", "food", "point_of_interest"]
  };
}

/**
 * Google Places Autocomplete Response
 */
export interface GooglePlacesAutocompleteResponse {
  suggestions: GooglePlaceAutocomplete[];
}

/**
 * Google Place Details - Location
 */
export interface GooglePlaceLocation {
  latitude: number;
  longitude: number;
}

/**
 * Google Place Details - Address Component
 */
export interface GoogleAddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

/**
 * Google Place Details Response
 */
export interface GooglePlaceDetails {
  id: string; // Place ID
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  location: GooglePlaceLocation;
  types: string[]; // ["restaurant", "food", "point_of_interest"]
  addressComponents?: GoogleAddressComponent[];
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string; // "PRICE_LEVEL_FREE" | "PRICE_LEVEL_INEXPENSIVE" | etc.
  businessStatus?: string; // "OPERATIONAL" | "CLOSED_TEMPORARILY" | etc.
  googleMapsUri?: string;
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
}

/**
 * Google Places検索オプション
 */
export interface PlacesSearchOptions {
  query: string;
  locationBias?: {
    circle?: {
      center: { latitude: number; longitude: number };
      radius: number; // メートル単位
    };
  };
  languageCode?: string; // "ja", "en" など
  includedRegionCodes?: string[]; // ["jp"]
  sessionToken?: string; // Autocomplete Session用トークン（コスト最適化）
}
