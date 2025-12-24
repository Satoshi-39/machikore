/**
 * City GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { CityRow } from '@/shared/types/database.types';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';

interface CityFeatureProperties {
  id: string;
  name: string;
}

/**
 * CityデータをGeoJSON形式に変換（座標を持つもののみ）
 * 現在のロケールに応じて翻訳された名前を使用
 */
export function useCitiesGeoJson(
  cities: CityRow[]
): FeatureCollection<Point, CityFeatureProperties> {
  const { locale } = useI18n();

  return useMemo(() => {
    const citiesWithCoords = cities.filter(
      (city) => city.latitude !== null && city.longitude !== null
    );

    return {
      type: 'FeatureCollection',
      features: citiesWithCoords.map((city) => ({
        type: 'Feature',
        id: city.id,
        geometry: {
          type: 'Point',
          coordinates: [city.longitude!, city.latitude!],
        },
        properties: {
          id: city.id,
          name: getTranslatedName(city.name, city.name_translations, locale),
        },
      })),
    };
  }, [cities, locale]);
}
