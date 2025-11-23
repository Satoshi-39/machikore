/**
 * Machi GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { MachiRow } from '@/shared/types/database.types';

interface MachiFeatureProperties {
  id: string;
  name: string;
  isVisited: boolean;
}

/**
 * MachiデータをGeoJSON形式に変換
 */
export function useMachiGeoJson(
  machiData: MachiRow[] | undefined,
  visitedMachiIds: Set<string>
): FeatureCollection<Point, MachiFeatureProperties> {
  return useMemo(() => {
    if (!machiData) {
      return { type: 'FeatureCollection', features: [] };
    }

    return {
      type: 'FeatureCollection',
      features: machiData.map((machi) => ({
        type: 'Feature',
        id: machi.id,
        geometry: {
          type: 'Point',
          coordinates: [machi.longitude, machi.latitude],
        },
        properties: {
          id: machi.id,
          name: machi.name,
          isVisited: visitedMachiIds.has(machi.id),
        },
      })),
    };
  }, [machiData, visitedMachiIds]);
}
