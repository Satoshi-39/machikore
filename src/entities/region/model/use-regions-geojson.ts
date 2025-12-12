/**
 * Region GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { RegionDataWithCoords } from '@/shared/lib/utils/regions.utils';

interface RegionFeatureProperties {
  id: string;
  name: string;
}

/**
 * RegionデータをGeoJSON形式に変換
 */
export function useRegionsGeoJson(
  regions: RegionDataWithCoords[]
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
