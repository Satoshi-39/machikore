/**
 * 地方データユーティリティ
 */

import regionsData from '@/shared/assets/data/regions.json';
import type { RegionRow } from '@/shared/types/database.types';

/** 座標付き地方データの型 */
export interface RegionDataWithCoords {
  id: string;
  name: string;
  name_kana: string;
  latitude: number;
  longitude: number;
  country_code: string;
  display_order: number;
}

/**
 * 地方データを取得（RegionRow形式）
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

/**
 * 座標付き地方データを取得（JSONから直接）
 */
export function getRegionsDataWithCoords(): RegionDataWithCoords[] {
  return regionsData as RegionDataWithCoords[];
}
