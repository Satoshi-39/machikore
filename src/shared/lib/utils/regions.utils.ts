/**
 * 地方データユーティリティ
 */

import regionsData from '@/shared/assets/data/regions.json';
import type { RegionRow } from '@/shared/types/database.types';

/**
 * 地方データを取得
 */
export function getRegionsData(): RegionRow[] {
  const now = new Date().toISOString();

  return regionsData.map((region) => ({
    id: region.id,
    name: region.name,
    name_kana: region.name_kana,
    name_translations: null, // TODO: Add translations when available
    country_code: region.country_code,
    display_order: region.display_order,
    created_at: now,
    updated_at: now,
  }));
}
