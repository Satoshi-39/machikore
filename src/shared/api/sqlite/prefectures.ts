/**
 * Prefectures SQLite API
 */

import { getDatabase } from './client';
import type { PrefectureRow } from '@/shared/types/database.types';

// ===============================
// Create
// ===============================

/**
 * 都道府県を一括挿入
 */
export function bulkInsertPrefectures(prefectures: PrefectureRow[]): void {
  const db = getDatabase();

  db.withTransactionSync(() => {
    for (const prefecture of prefectures) {
      db.runSync(
        `INSERT OR REPLACE INTO prefectures (
          id, name, name_kana, name_translations, region_id, latitude, longitude, country_code, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prefecture.id,
          prefecture.name,
          prefecture.name_kana,
          prefecture.name_translations,
          prefecture.region_id,
          prefecture.latitude,
          prefecture.longitude,
          prefecture.country_code,
          prefecture.created_at,
          prefecture.updated_at,
        ]
      );
    }
  });

  console.log(`✅ ${prefectures.length}件の都道府県データを挿入`);
}

// ===============================
// Read
// ===============================

/**
 * 都道府県数を取得
 */
export function getPrefectureCount(): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM prefectures'
  );
  return result?.count ?? 0;
}

/**
 * 都道府県を取得（IDで）
 */
export function getPrefectureById(id: string): PrefectureRow | null {
  const db = getDatabase();
  const result = db.getFirstSync<PrefectureRow>(
    'SELECT * FROM prefectures WHERE id = ?',
    [id]
  );
  return result ?? null;
}

/**
 * 全都道府県を取得
 */
export function getAllPrefectures(): PrefectureRow[] {
  const db = getDatabase();
  return db.getAllSync<PrefectureRow>('SELECT * FROM prefectures ORDER BY id');
}

/**
 * 地方別に都道府県を取得（region_idで）
 */
export function getPrefecturesByRegionId(regionId: string): PrefectureRow[] {
  const db = getDatabase();
  return db.getAllSync<PrefectureRow>(
    'SELECT * FROM prefectures WHERE region_id = ? ORDER BY id',
    [regionId]
  );
}
