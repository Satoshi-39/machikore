/**
 * 場所検索Feature - ドメイン型定義
 *
 * アプリ内部で使用する型（Google API型とは分離）
 */

import type { GooglePlaceDetails } from '../api/google-places.types';

// ===============================
// 街コレ内検索用型
// ===============================

/**
 * 街コレ内検索結果の種類
 */
export type MachikorePlaceType = 'machi' | 'spot' | 'city' | 'prefecture' | 'region' | 'country';

/**
 * 街コレ内検索結果
 */
export interface MachikorePlaceSearchResult {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  type: MachikorePlaceType;
  // spotの場合の追加情報
  userId?: string;
  mapId?: string;
  googleTypes?: string[] | null;
}

/**
 * 街コレ内検索オプション
 */
export interface MachikorePlaceSearchOptions {
  query: string;
  userId?: string | null; // 指定した場合、そのユーザーのspotsのみ検索
  includeAllSpots?: boolean; // trueの場合、全ユーザーのspotsを検索（デフォルトマップ用）
  limit?: number;
}

// ===============================
// Google Places検索用型
// ===============================

/**
 * Autocomplete結果のみで表示に必要なデータ
 * Place Details取得前の一覧表示用
 */
export interface PlaceAutocompleteSuggestion {
  placeId: string;
  name: string;           // structuredFormat.mainText.text
  address: string;        // structuredFormat.secondaryText.text
  types: string[];        // placePrediction.types
}

/**
 * アプリ内で使用する場所データ（統一インターフェース）
 * Google Places APIから取得した場所
 */
export interface PlaceSearchResult {
  id: string; // Google Place ID
  name: string;
  shortAddress: string | null; // 短縮住所（表示用）
  formattedAddress: string | null; // 完全住所（コピー用）
  latitude: number;
  longitude: number;
  category: string[]; // types
  googleData: {
    placeId: string;
    placeName: string;
    category: string[]; // types
    shortAddress: string | null; // 短縮住所（表示用）
    formattedAddress: string | null; // 完全住所（コピー用）
  };
}

/**
 * 手動で登録する場所データ（現在地・ピン刺し用）
 * Google Places情報を持たない
 */
export interface ManualLocationInput {
  id: string; // UUID（一時的なID）
  name: string | null; // 手動入力 or null
  shortAddress: string | null; // 短縮住所（表示用）- 逆ジオコーディングで取得
  formattedAddress: string | null; // 完全住所（コピー用）- 逆ジオコーディングで取得
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
  // sublocality_level_2（大字・町名）を優先、なければsublocality_level_1、最後にsublocality
  // 例: "江崎字和井田" の場合、"江崎"（level_2）を取得したい
  const sublocality =
    getComponent('sublocality_level_2') ||
    getComponent('sublocality_level_1') ||
    getComponent('sublocality');

  // 短い住所: "東京都渋谷区神南" のような形式
  const shortAddress = [prefecture, city, sublocality].filter(Boolean).join('');

  return {
    id: details.id,
    name: details.displayName.text,
    shortAddress: shortAddress || null,
    formattedAddress: details.formattedAddress || null,
    latitude: details.location.latitude,
    longitude: details.location.longitude,
    category: details.types || [],
    googleData: {
      placeId: details.id,
      placeName: details.displayName.text,
      category: details.types || [],
      shortAddress: shortAddress || null,
      formattedAddress: details.formattedAddress || null,
    },
  };
}
