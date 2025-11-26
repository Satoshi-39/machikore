/**
 * Master Spots GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import { determineSpotCategory, type SpotCategory } from './categories';

// GeoJSON変換に必要な最小限のフィールド
interface MasterSpotForGeoJson {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_types: string | null;
}

interface MasterSpotFeatureProperties {
  id: string;
  name: string;
  category: SpotCategory;
}

/**
 * Master SpotsデータをGeoJSON形式に変換
 */
export function useMasterSpotsGeoJson(
  masterSpots: MasterSpotForGeoJson[] | undefined
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
