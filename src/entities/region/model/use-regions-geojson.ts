/**
 * Region GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { RegionRow } from '@/shared/types/database.types';

interface RegionFeatureProperties {
  id: string;
  name: string;
}

/**
 * RegionデータをGeoJSON形式に変換
 */
export function useRegionsGeoJson(
  regions: RegionRow[]
): FeatureCollection<Point, RegionFeatureProperties> {
  return useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: regions.map((region) => ({
        type: 'Feature',
        id: region.id,
        geometry: {
          type: 'Point',
          coordinates: [region.longitude, region.latitude],
        },
        properties: {
          id: region.id,
          name: region.name,
        },
      })),
    };
  }, [regions]);
}
