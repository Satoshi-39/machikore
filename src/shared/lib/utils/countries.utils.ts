/**
 * 国データ読み込みユーティリティ
 */

import countriesData from '@/shared/assets/data/countries.json';
import type { CountryRow } from '@/shared/types/database.types';

/**
 * 国データを取得（JSONから）
 */
export function getCountriesData(): CountryRow[] {
  return countriesData as CountryRow[];
}
