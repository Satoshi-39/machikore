/**
 * 都道府県データ読み込みユーティリティ
 */

import prefecturesData from '@/shared/assets/data/prefectures.json';
import type { PrefectureRow } from '@/shared/types/database.types';

/**
 * 都道府県データを取得（JSONから）
 *
 * Note: これは初期データ読み込み専用です。
 * アプリ内でのデータ取得は src/shared/api/sqlite/prefectures.ts を使用してください。
 */
export function getPrefecturesData(): PrefectureRow[] {
  const now = new Date().toISOString();

  return prefecturesData.map((p) => ({
    ...p,
    latitude: 'latitude' in p ? p.latitude : null,
    longitude: 'longitude' in p ? p.longitude : null,
    name_translations: null, // TODO: Add translations when available
    created_at: now,
    updated_at: now,
  })) as PrefectureRow[];
}
