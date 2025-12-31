/**
 * Prefecture GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { PrefectureRow } from '@/shared/types/database.types';
import { useI18n, getTranslatedName, type TranslationsData } from '@/shared/lib/i18n';

interface PrefectureFeatureProperties {
  id: string;
  name: string;
}

/**
 * PrefectureデータをGeoJSON形式に変換（座標を持つもののみ）
 * 現在のロケールに応じて翻訳された名前を使用
 */
export function usePrefecturesGeoJson(
  prefectures: PrefectureRow[]
): FeatureCollection<Point, PrefectureFeatureProperties> {
  const { locale } = useI18n();

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
          name: getTranslatedName(pref.name, pref.name_translations as TranslationsData, locale),
        },
      })),
    };
  }, [prefectures, locale]);
}
