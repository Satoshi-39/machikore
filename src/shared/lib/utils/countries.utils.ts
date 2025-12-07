/**
 * 国データ読み込みユーティリティ
 */

import countriesData from '@/shared/assets/data/countries.json';

export interface CountryData {
  id: string;
  name: string;
  name_kana: string;
  latitude: number;
  longitude: number;
  country_code: string;
}

/**
 * 国データを取得（JSONから）
 */
export function getCountriesData(): CountryData[] {
  return countriesData as CountryData[];
}
