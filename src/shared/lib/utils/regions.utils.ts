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
// Note: idは{country}_{region}形式（例: jp_kanto）、country_idはidから取得
interface RegionJsonData {
  id: string; // {country}_{region}形式
  name: string;
  name_kana: string;
  name_translations?: { [key: string]: string };
  latitude: number;
  longitude: number;
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
 * Note: idから国コードを抽出（例: jp_kanto → jp）
 */
function toRegionRow(region: RegionJsonData): RegionRow {
  const now = new Date().toISOString();
  // idの形式: {country}_{region}（例: jp_kanto）から国コードを抽出
  const parts = region.id.split('_');
  const countryId = parts[0] ?? region.id;
  return {
    id: region.id,
    name: region.name,
    name_kana: region.name_kana,
    name_translations: region.name_translations ?? null,
    latitude: region.latitude,
    longitude: region.longitude,
    country_id: countryId,
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
