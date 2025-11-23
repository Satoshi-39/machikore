/**
 * Prefecture GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { PrefectureRow } from '@/shared/types/database.types';

interface PrefectureFeatureProperties {
  id: string;
  name: string;
}

/**
 * PrefectureデータをGeoJSON形式に変換（座標を持つもののみ）
 */
export function usePrefecturesGeoJson(
  prefectures: PrefectureRow[]
): FeatureCollection<Point, PrefectureFeatureProperties> {
  return useMemo(() => {
    const prefecturesWithCoords = prefectures.filter(
      (pref) => pref.latitude !== null && pref.longitude !== null
    );

    return {
      type: 'FeatureCollection',
      features: prefecturesWithCoords.map((pref) => ({
        type: 'Feature',
        id: pref.id,
        geometry: {
          type: 'Point',
          coordinates: [pref.longitude!, pref.latitude!],
        },
        properties: {
          id: pref.id,
          name: pref.name,
        },
      })),
    };
  }, [prefectures]);
}
