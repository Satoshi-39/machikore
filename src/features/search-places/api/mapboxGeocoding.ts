/**
 * Mapbox Geocoding API v6
 * https://docs.mapbox.com/api/search/geocoding/
 */

import { ENV } from '@/shared/config';
import type {
  MapboxGeocodingResponse,
  GeocodingSearchOptions,
  PlaceSearchResult,
  MapboxFeature,
} from './types';

const MAPBOX_GEOCODING_BASE_URL =
  'https://api.mapbox.com/search/geocode/v6/forward';

/**
 * Mapbox Geocoding API v6で場所を検索
 */
export async function searchPlaces(
  options: GeocodingSearchOptions
): Promise<PlaceSearchResult[]> {
  const {
    query,
    proximity,
    bbox,
    language = 'ja',
    limit = 10,
    types,
    country = ['jp'],
  } = options;

  // URLパラメータを構築
  const params = new URLSearchParams({
    q: query,
    language,
    limit: limit.toString(),
    access_token: ENV.MAPBOX_ACCESS_TOKEN,
    permanent: 'true', // 永続的なmapbox_idを取得
  });

  // オプショナルパラメータを追加
  if (proximity) {
    params.append('proximity', `${proximity[0]},${proximity[1]}`);
  }
  if (bbox) {
    params.append('bbox', bbox.join(','));
  }
  if (types && types.length > 0) {
    params.append('types', types.join(','));
  }
  if (country && country.length > 0) {
    params.append('country', country.join(','));
  }

  try {
    const response = await fetch(`${MAPBOX_GEOCODING_BASE_URL}?${params}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ [Mapbox API] エラーレスポンス:', errorBody);
      throw new Error(`Mapbox API error: ${response.status} - ${errorBody}`);
    }

    const data: MapboxGeocodingResponse = await response.json();

    // デバッグ：レスポンスを確認
    console.log(`📊 [Mapbox API] "${query}" の検索結果:`, data.features.length, '件');
    if (data.features.length > 0) {
      console.log('最初の3件のタイプ:', data.features.slice(0, 3).map(f => ({
        name: f.properties.name,
        type: f.properties.feature_type,
      })));
    }

    // MapboxFeatureをPlaceSearchResultに変換
    return data.features.map((feature) => convertToPlaceResult(feature));
  } catch (error) {
    console.error('場所検索エラー:', error);
    throw error;
  }
}

/**
 * MapboxFeatureをアプリ内のPlaceSearchResultに変換
 */
function convertToPlaceResult(feature: MapboxFeature): PlaceSearchResult {
  const { properties, geometry } = feature;
  const [longitude, latitude] = geometry.coordinates;

  return {
    id: properties.mapbox_id,
    name: properties.name_preferred || properties.name,
    address: properties.place_formatted || null,
    latitude,
    longitude,
    category: properties.feature_type ? [properties.feature_type] : [],
    mapboxData: {
      placeId: properties.mapbox_id,
      placeName: properties.name_preferred || properties.name,
      category: properties.feature_type ? [properties.feature_type] : [],
      address: properties.place_formatted || null,
      context: properties.context,
    },
  };
}
