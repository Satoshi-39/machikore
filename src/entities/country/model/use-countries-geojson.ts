/**
 * Country GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { CountryRow } from '@/shared/types/database.types';

interface CountryFeatureProperties {
  id: string;
  name: string;
  code: string;
}

/**
 * CountryデータをGeoJSON形式に変換
 * Note: countries.idは国コード（jp, kr, cn...）なのでcodeにはidを使用
 */
export function useCountriesGeoJson(
  countries: CountryRow[]
): FeatureCollection<Point, CountryFeatureProperties> {
  return useMemo(() => {
    // 座標がnullのデータは除外
    const validCountries = countries.filter(
      (country) => country.longitude != null && country.latitude != null
    );
    return {
      type: 'FeatureCollection',
      features: validCountries.map((country) => ({
        type: 'Feature' as const,
        id: country.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [country.longitude!, country.latitude!],
        },
        properties: {
          id: country.id,
          name: country.name,
          code: country.id, // countries.idは国コード（jp, kr, cn...）
        },
      })),
    };
  }, [countries]);
}
