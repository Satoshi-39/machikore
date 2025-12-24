/**
 * 大陸データ読み込みユーティリティ
 */

import continentsData from '@/shared/assets/data/continents.json';
import type { ContinentRow } from '@/shared/types/database.types';

// 大陸データの型（JSONから読み込む形式）
interface ContinentJsonData {
  id: string;
  name: string;
  name_translations?: { [key: string]: string };
  display_order: number;
  latitude: number;
  longitude: number;
}

/**
 * JSONデータをContinentRowに変換
 */
function toContinentRow(continent: ContinentJsonData): ContinentRow {
  const now = new Date().toISOString();
  return {
    id: continent.id,
    name: continent.name,
    name_kana: null,
    name_translations: continent.name_translations ?? null,
    display_order: continent.display_order,
    latitude: continent.latitude,
    longitude: continent.longitude,
    created_at: now,
    updated_at: now,
  };
}

/**
 * 全ての大陸データを取得（JSONから）
 */
export function getContinentsData(): ContinentRow[] {
  return (continentsData as ContinentJsonData[]).map(toContinentRow);
}

/**
 * 大陸IDから大陸データを取得
 */
export function getContinentById(continentId: string): ContinentRow | undefined {
  return getContinentsData().find((c) => c.id === continentId);
}
