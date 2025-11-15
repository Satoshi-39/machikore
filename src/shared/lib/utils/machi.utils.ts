/**
 * 街データ読み込みユーティリティ
 *
 * JSONファイルから街データを読み込む静的ユーティリティ
 * Note: 実際のDBアクセスは src/shared/api/sqlite/machi.ts を使用
 */

import machiData from '@/shared/assets/data/machi.json';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * 街データを取得（JSONから）
 *
 * Note: これは初期データ読み込み専用です。
 * アプリ内でのデータ取得は src/shared/api/sqlite/machi.ts を使用してください。
 */
export function getMachiData(): MachiRow[] {
  const now = new Date().toISOString();

  return machiData.map((m) => ({
    ...m,
    lines: m.lines ? JSON.stringify(m.lines) : null, // Convert array to JSON string
    name_translations: null, // TODO: Add translations when available
    prefecture_name_translations: null, // TODO: Add translations when available
    city_name_translations: null, // TODO: Add translations when available
    created_at: now,
    updated_at: now,
  })) as MachiRow[];
}

/**
 * 街データの総数（JSONから）
 */
export function getMachiCount(): number {
  return machiData.length;
}

/**
 * IDで街を検索（JSONから）
 */
export function findMachiById(machiId: string): MachiRow | undefined {
  return machiData.find((machi) => machi.id === machiId) as
    | MachiRow
    | undefined;
}
