/**
 * 国データ読み込みユーティリティ
 */

import countriesData from '@/shared/assets/data/countries.json';
import type { CountryRow } from '@/shared/types/database.types';

// 国データの型（JSONから読み込む形式）
interface CountryJsonData {
  id: string;
  name: string;
  name_en: string;
  name_kana: string;
  latitude: number;
  longitude: number;
  country_code: string;
}

/**
 * 国データを取得（JSONから）
 */
export function getCountriesData(): CountryRow[] {
  return (countriesData as CountryJsonData[]).map((country) => ({
    id: country.id,
    name: country.name,
    name_en: country.name_en,
    name_kana: country.name_kana,
    latitude: country.latitude,
    longitude: country.longitude,
    country_code: country.country_code,
  }));
}

/**
 * 国コードから国データを取得
 */
export function getCountryByCode(countryCode: string): CountryRow | undefined {
  return getCountriesData().find((c) => c.country_code === countryCode);
}

/**
 * 利用可能な国コードの一覧を取得
 */
export function getAvailableCountryCodes(): string[] {
  return getCountriesData().map((c) => c.country_code);
}
