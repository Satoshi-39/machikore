/**
 * Country GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';

interface CountryRow {
  id: string;
  name: string;
  name_kana: string;
  latitude: number;
  longitude: number;
  country_code: string;
}

interface CountryFeatureProperties {
  id: string;
  name: string;
}

/**
 * CountryデータをGeoJSON形式に変換
 */
export function useCountriesGeoJson(
  countries: CountryRow[]
): FeatureCollection<Point, CountryFeatureProperties> {
  return useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: countries.map((country) => ({
        type: 'Feature',
        id: country.id,
        geometry: {
          type: 'Point',
          coordinates: [country.longitude, country.latitude],
        },
        properties: {
          id: country.id,
          name: country.name,
        },
      })),
    };
  }, [countries]);
}
