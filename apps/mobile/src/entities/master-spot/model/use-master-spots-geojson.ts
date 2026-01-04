/**
 * Master Spots GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import { determineSpotCategory, type SpotCategory } from './spot-type';
import { extractName } from '@/shared/lib/utils/multilang.utils';
import { getCurrentLocale } from '@/shared/lib/i18n';
import type { Json } from '@/shared/types/database.types';

// GeoJSON変換に必要な最小限のフィールド
export interface MasterSpotForGeoJson {
  id: string;
  name: Json; // JSONB型（多言語対応）
  latitude: number;
  longitude: number;
  google_types: string[] | null;
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

    const locale = getCurrentLocale();

    return {
      type: 'FeatureCollection',
      features: masterSpots.map((spot) => ({
        type: 'Feature' as const,
        id: spot.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [spot.longitude, spot.latitude],
        },
        properties: {
          id: spot.id,
          name: extractName(spot.name, locale) || '',
          category: determineSpotCategory(spot.google_types),
        },
      })),
    };
  }, [masterSpots]);
}
