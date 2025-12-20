/**
 * 大陸データ読み込みユーティリティ
 */

import continentsData from '@/shared/assets/data/continents.json';
import type { ContinentRow } from '@/shared/types/database.types';

// 大陸データの型（JSONから読み込む形式）
interface ContinentJsonData {
  id: string;
  name: string;
  display_order: number;
}

/**
 * JSONデータをContinentRowに変換
 */
function toContinentRow(continent: ContinentJsonData): ContinentRow {
  const now = new Date().toISOString();
  return {
    id: continent.id,
    name: continent.name,
    display_order: continent.display_order,
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
