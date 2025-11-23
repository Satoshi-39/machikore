/**
 * Master Spots GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { MasterSpotRow } from '@/shared/types/database.types';
import { determineSpotCategory, type SpotCategory } from './categories';

interface MasterSpotFeatureProperties {
  id: string;
  name: string;
  category: SpotCategory;
}

/**
 * Master SpotsデータをGeoJSON形式に変換
 */
export function useMasterSpotsGeoJson(
  masterSpots: MasterSpotRow[] | undefined
): FeatureCollection<Point, MasterSpotFeatureProperties> {
  return useMemo(() => {
    if (!masterSpots || masterSpots.length === 0) {
      return { type: 'FeatureCollection', features: [] };
    }

    return {
      type: 'FeatureCollection',
      features: masterSpots.map((spot) => ({
        type: 'Feature',
        id: spot.id,
        geometry: {
          type: 'Point',
          coordinates: [spot.longitude, spot.latitude],
        },
        properties: {
          id: spot.id,
          name: spot.name,
          category: determineSpotCategory(spot.google_types),
        },
      })),
    };
  }, [masterSpots]);
}
