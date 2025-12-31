/**
 * Prefectures SQLite API
 */

import { getDatabase } from './client';
import type { PrefectureRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';
import { parseJsonField } from '@/shared/lib/utils/json.utils';

// ===============================
// Create
// ===============================

/**
 * 都道府県を一括挿入
 * Note: country_codeは持たない（region_id経由で国を取得）
 */
export function bulkInsertPrefectures(prefectures: PrefectureRow[]): void {
  const db = getDatabase();

  db.withTransactionSync(() => {
    for (const prefecture of prefectures) {
      db.runSync(
        `INSERT OR REPLACE INTO prefectures (
          id, name, name_kana, name_translations, region_id, latitude, longitude, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prefecture.id,
          prefecture.name,
          prefecture.name_kana,
          typeof prefecture.name_translations === 'string'
            ? prefecture.name_translations
            : JSON.stringify(prefecture.name_translations),
          prefecture.region_id,
          prefecture.latitude,
          prefecture.longitude,
          prefecture.created_at,
          prefecture.updated_at,
        ]
      );
    }
  });

  log.info(`[SQLite] ${prefectures.length}件の都道府県データを挿入`);
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

/** SQLiteから取得したデータのname_translationsをパース */
function fromSQLitePrefecture(row: Record<string, unknown>): PrefectureRow {
  return {
    ...row,
    name_translations: parseJsonField(row.name_translations as string | null | Record<string, string>),
  } as PrefectureRow;
}

/**
 * 全都道府県を取得
 */
export function getAllPrefectures(): PrefectureRow[] {
  const db = getDatabase();
  const rows = db.getAllSync<Record<string, unknown>>('SELECT * FROM prefectures ORDER BY id');
  return rows.map(fromSQLitePrefecture);
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

/**
 * 位置情報から最寄りの都道府県を取得
 */
export function getNearestPrefecture(
  latitude: number,
  longitude: number
): PrefectureRow | null {
  const db = getDatabase();

  // 緯度経度の差分で簡易的に距離を計算してソート
  const result = db.getFirstSync<PrefectureRow>(
    `SELECT *,
      ABS(latitude - ?) + ABS(longitude - ?) as distance
    FROM prefectures
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    ORDER BY distance
    LIMIT 1`,
    [latitude, longitude]
  );

  return result ?? null;
}
