/**
 * City GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { CityRow } from '@/shared/types/database.types';

interface CityFeatureProperties {
  id: string;
  name: string;
}

/**
 * CityデータをGeoJSON形式に変換（座標を持つもののみ）
 */
export function useCitiesGeoJson(
  cities: CityRow[]
): FeatureCollection<Point, CityFeatureProperties> {
  return useMemo(() => {
    const citiesWithCoords = cities.filter(
      (city) => city.latitude !== null && city.longitude !== null
    );

    return {
      type: 'FeatureCollection',
      features: citiesWithCoords.map((city) => ({
        type: 'Feature',
        id: city.id,
        geometry: {
          type: 'Point',
          coordinates: [city.longitude!, city.latitude!],
        },
        properties: {
          id: city.id,
          name: city.name,
        },
      })),
    };
  }, [cities]);
}
