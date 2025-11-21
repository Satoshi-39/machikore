/**
 * Mapbox Geocoding API v6 型定義
 * https://docs.mapbox.com/api/search/geocoding/
 */

/**
 * Mapbox Geocoding API v6 検索結果（Feature）
 */
export interface MapboxFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    mapbox_id: string; // Mapboxの一意ID（permanent=trueの時に使用）
    name: string; // 場所の名前
    name_preferred?: string; // 優先される名前（ローカライズ対応）
    place_formatted?: string; // フォーマット済み住所
    full_address?: string; // 完全な住所
    coordinates?: {
      longitude: number;
      latitude: number;
    };
    context?: {
      // コンテキスト情報（地域、国など）
      country?: { name: string; country_code: string };
      region?: { name: string; region_code: string };
      place?: { name: string };
      postcode?: { name: string };
      locality?: { name: string };
      neighborhood?: { name: string };
      street?: { name: string };
    };
    feature_type?: string; // "poi", "address", "street", "neighborhood", "locality", "place", "district", "postcode", "region", "country"
    maki?: string; // アイコン識別子
    metadata?: Record<string, any>; // その他のメタデータ
  };
}

/**
 * Mapbox Geocoding API v6 レスポンス
 */
export interface MapboxGeocodingResponse {
  type: 'FeatureCollection';
  features: MapboxFeature[];
  attribution: string;
}

/**
 * Mapbox Geocoding API v6 検索オプション
 */
export interface GeocodingSearchOptions {
  query: string;
  proximity?: [number, number]; // [longitude, latitude] - ユーザーの現在地など
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  language?: string; // "ja", "en" など
  limit?: number; // 結果の最大件数（デフォルト: 5）
  types?: string[]; // フィルタリング用: ["poi", "address", "place"]
  country?: string[]; // 国コード: ["jp"]
}

/**
 * アプリ内で使用する場所データ（シンプル化）
 */
export interface PlaceSearchResult {
  id: string; // mapbox_id
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  category: string[]; // feature_type等をカテゴリーとして保存
  mapboxData: {
    placeId: string; // mapbox_id
    placeName: string; // name_preferred || name
    category: string[]; // [feature_type]
    address: string | null; // place_formatted
    context: MapboxFeature['properties']['context']; // context情報を丸ごと保存
  };
}
