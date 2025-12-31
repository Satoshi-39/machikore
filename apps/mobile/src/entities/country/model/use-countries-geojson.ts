/**
 * Country GeoJSON変換フック
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { CountryRow } from '@/shared/types/database.types';
import { useI18n, getTranslatedName, type TranslationsData } from '@/shared/lib/i18n';

interface CountryFeatureProperties {
  id: string;
  name: string;
  code: string;
}

/**
 * CountryデータをGeoJSON形式に変換
 * Note: countries.idは国コード（jp, kr, cn...）なのでcodeにはidを使用
 * 現在のロケールに応じて翻訳された名前を使用
 */
export function useCountriesGeoJson(
  countries: CountryRow[]
): FeatureCollection<Point, CountryFeatureProperties> {
  const { locale } = useI18n();

  return useMemo(() => {
    // 座標がnullのデータは除外
    const validCountries = countries.filter(
      (country) => country.longitude != null && country.latitude != null
    );
    return {
      type: 'FeatureCollection',
      features: validCountries.map((country) => ({
        type: 'Feature' as const,
        id: country.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [country.longitude!, country.latitude!],
        },
        properties: {
          id: country.id,
          name: getTranslatedName(country.name, country.name_translations as TranslationsData, locale),
          code: country.id, // countries.idは国コード（jp, kr, cn...）
        },
      })),
    };
  }, [countries, locale]);
}
