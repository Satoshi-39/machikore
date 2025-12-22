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
    // 座標がnullのデータは除外
    const validRegions = regions.filter(
      (region) => region.longitude != null && region.latitude != null
    );
    return {
      type: 'FeatureCollection',
      features: validRegions.map((region) => ({
        type: 'Feature' as const,
        id: region.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [region.longitude!, region.latitude!],
        },
        properties: {
          id: region.id,
          name: region.name,
        },
      })),
    };
  }, [regions]);
}
