/**
 * 地方データ読み込みユーティリティ
 */

import type { RegionRow } from '@/shared/types/database.types';

// 各国の地方データをインポート
import jpRegions from '@/shared/assets/data/regions/jp.json';
import usRegions from '@/shared/assets/data/regions/us.json';
import krRegions from '@/shared/assets/data/regions/kr.json';
import twRegions from '@/shared/assets/data/regions/tw.json';
import cnRegions from '@/shared/assets/data/regions/cn.json';
import thRegions from '@/shared/assets/data/regions/th.json';

// 地方データの型（JSONから読み込む形式）
interface RegionJsonData {
  id: string;
  name: string;
  name_en: string;
  name_kana: string;
  latitude: number;
  longitude: number;
  country_code: string; // JSONではcountry_codeだが、DBではcountry_idとして使用
  display_order: number;
}

// 国コードと地方データのマッピング
const regionsByCountry: Record<string, RegionJsonData[]> = {
  jp: jpRegions as RegionJsonData[],
  us: usRegions as RegionJsonData[],
  kr: krRegions as RegionJsonData[],
  tw: twRegions as RegionJsonData[],
  cn: cnRegions as RegionJsonData[],
  th: thRegions as RegionJsonData[],
};

/**
 * JSONデータをRegionRowに変換
 * Note: JSONのcountry_codeはDBのcountry_id（countries.id）に対応
 */
function toRegionRow(region: RegionJsonData): RegionRow {
  const now = new Date().toISOString();
  return {
    id: region.id,
    name: region.name,
    name_kana: region.name_kana,
    name_translations: JSON.stringify({ en: region.name_en }),
    latitude: region.latitude,
    longitude: region.longitude,
    country_id: region.country_code, // country_codeをcountry_idとして使用
    display_order: region.display_order,
    created_at: now,
    updated_at: now,
  };
}

/**
 * 全ての地方データを取得（JSONから）
 */
export function getRegionsData(): RegionRow[] {
  return Object.values(regionsByCountry)
    .flat()
    .map(toRegionRow);
}

/**
 * 特定の国の地方データを取得
 */
export function getRegionsByCountry(countryCode: string): RegionRow[] {
  const regions = regionsByCountry[countryCode];
  if (!regions) {
    return [];
  }
  return regions.map(toRegionRow);
}

/**
 * 利用可能な国コードの一覧を取得
 */
export function getAvailableRegionCountryCodes(): string[] {
  return Object.keys(regionsByCountry);
}
