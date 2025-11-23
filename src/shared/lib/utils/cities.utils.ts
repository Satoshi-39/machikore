/**
 * 市区町村データ読み込みユーティリティ
 */

import citiesData from '@/shared/assets/data/cities.json';
import type { CityRow } from '@/shared/types/database.types';

/**
 * 市区町村データを取得（JSONから）
 *
 * Note: これは初期データ読み込み専用です。
 * アプリ内でのデータ取得は src/shared/api/sqlite/cities.ts を使用してください。
 */
export function getCitiesData(): CityRow[] {
  const now = new Date().toISOString();

  return citiesData.map((c) => ({
    ...c,
    latitude: 'latitude' in c ? c.latitude : null,
    longitude: 'longitude' in c ? c.longitude : null,
    name_translations: null, // TODO: Add translations when available
    created_at: now,
    updated_at: now,
  })) as CityRow[];
}
