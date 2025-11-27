/**
 * 場所検索Feature - ドメイン型定義
 *
 * アプリ内部で使用する型（Google API型とは分離）
 */

import type { GooglePlaceDetails } from '../api/google-places.types';

/**
 * アプリ内で使用する場所データ（統一インターフェース）
 * Google Places APIから取得した場所
 */
export interface PlaceSearchResult {
  id: string; // Google Place ID
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  category: string[]; // types
  googleData: {
    placeId: string;
    placeName: string;
    category: string[]; // types
    address: string | null;
    formattedAddress?: string;
    internationalPhoneNumber?: string;
    websiteUri?: string;
    rating?: number;
    userRatingCount?: number;
  };
}

/**
 * 手動で登録する場所データ（現在地・ピン刺し用）
 * Google Places情報を持たない
 */
export interface ManualLocationInput {
  id: string; // UUID（一時的なID）
  name: string | null; // 手動入力 or null
  address: string | null; // 逆ジオコーディングで取得 or null
  latitude: number;
  longitude: number;
  category: string[]; // 空配列
  source: 'current_location' | 'map_pin'; // 登録元を識別
}

/**
 * スポット作成時に使用する場所データの統合型
 * Google Places検索結果 または 手動登録のいずれか
 */
export type SpotLocationInput = PlaceSearchResult | ManualLocationInput;

/**
 * SpotLocationInputがPlaceSearchResultかどうかを判定する型ガード
 */
export function isPlaceSearchResult(
  input: SpotLocationInput
): input is PlaceSearchResult {
  return 'googleData' in input;
}

/**
 * SpotLocationInputがManualLocationInputかどうかを判定する型ガード
 */
export function isManualLocationInput(
  input: SpotLocationInput
): input is ManualLocationInput {
  return 'source' in input;
}

/**
 * Google Place DetailsをアプリのPlaceSearchResultに変換
 */
export function convertToPlaceResult(
  details: GooglePlaceDetails
): PlaceSearchResult {
  // 住所コンポーネントから短縮住所を生成
  const addressComponents = details.addressComponents || [];
  const getComponent = (type: string) =>
    addressComponents.find((c) => c.types?.includes(type))?.longText || '';

  // 都道府県 + 市区町村 + 地域名 の短縮住所を構築
  const prefecture = getComponent('administrative_area_level_1');
  const city =
    getComponent('locality') || getComponent('administrative_area_level_2');
  const sublocality =
    getComponent('sublocality_level_1') || getComponent('sublocality');

  // 短い住所: "東京都渋谷区神南" のような形式
  const shortAddress = [prefecture, city, sublocality].filter(Boolean).join('');

  return {
    id: details.id,
    name: details.displayName.text,
    address: shortAddress || details.formattedAddress || null,
    latitude: details.location.latitude,
    longitude: details.location.longitude,
    category: details.types || [],
    googleData: {
      placeId: details.id,
      placeName: details.displayName.text,
      category: details.types || [],
      address: shortAddress || null,
      formattedAddress: details.formattedAddress,
      internationalPhoneNumber: details.internationalPhoneNumber,
      websiteUri: details.websiteUri,
      rating: details.rating,
      userRatingCount: details.userRatingCount,
    },
  };
}
