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

    // 座標がnullのデータは除外
    const validMachi = machiData.filter(
      (machi) => machi.longitude != null && machi.latitude != null
    );

    return {
      type: 'FeatureCollection',
      features: validMachi.map((machi) => ({
        type: 'Feature' as const,
        id: machi.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [machi.longitude!, machi.latitude!],
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
