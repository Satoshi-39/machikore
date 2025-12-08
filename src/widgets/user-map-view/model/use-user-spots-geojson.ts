/**
 * ユーザースポットをGeoJSON形式に変換するhook
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { SpotCategory } from '@/entities/master-spot/model';
import { determineSpotCategory } from '@/entities/master-spot';

interface UserSpotWithMasterSpot {
  id: string;
  custom_name: string | null;
  master_spot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    google_types: string[] | string | null;
  } | null;
}

interface UserSpotGeoJsonProperties {
  id: string;
  name: string;
  category: SpotCategory;
}

export function useUserSpotsGeoJson(
  spots: UserSpotWithMasterSpot[]
): FeatureCollection<Point, UserSpotGeoJsonProperties> {
  return useMemo(() => {
    const features = spots
      .filter((spot) => spot.master_spot !== null)
      .map((spot) => {
        const masterSpot = spot.master_spot!;
        const name = spot.custom_name || masterSpot.name;
        const category = determineSpotCategory(masterSpot.google_types);

        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [masterSpot.longitude, masterSpot.latitude],
          },
          properties: {
            id: spot.id,
            name,
            category,
          },
        };
      });

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [spots]);
}
