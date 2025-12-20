/**
 * Cities SQLite API
 *
 * SQLiteではJSONカラムを文字列として保存するため、
 * このDAO層でJSON変換を行い、外部には統一された型を公開する
 */

import { getDatabase } from './client';
import type { CityRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';

// ===============================
// JSON変換ヘルパー
// ===============================

/** SQLiteから取得した生データの型（JSONカラムは文字列） */
interface CityRowSQLite extends Omit<CityRow, 'name_translations'> {
  name_translations: string | null;
}

/** SQLiteの生データをCityRowに変換（JSON.parse） */
function fromSQLite(row: CityRowSQLite): CityRow {
  return {
    ...row,
    name_translations: row.name_translations ? JSON.parse(row.name_translations) : null,
  };
}

/** CityRowをSQLite保存用に変換（JSON.stringify） */
function toSQLite(city: CityRow): CityRowSQLite {
  return {
    ...city,
    name_translations: city.name_translations ? JSON.stringify(city.name_translations) : null,
  };
}

// ===============================
// Create
// ===============================

/**
 * 市区町村を一括挿入
 */
export function bulkInsertCities(cities: CityRow[]): void {
  const db = getDatabase();

  db.withTransactionSync(() => {
    for (const city of cities) {
      const row = toSQLite(city);
      db.runSync(
        `INSERT OR REPLACE INTO cities (
          id, prefecture_id, name, name_kana, name_translations, type, latitude, longitude, tile_id, country_code, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.prefecture_id,
          row.name,
          row.name_kana,
          row.name_translations,
          row.type,
          row.latitude,
          row.longitude,
          row.tile_id,
          row.country_code,
          row.created_at,
          row.updated_at,
        ]
      );
    }
  });

  log.info(`[SQLite] ${cities.length}件の市区町村データを挿入`);
}

// ===============================
// Read
// ===============================

/**
 * 市区町村数を取得
 */
export function getCityCount(): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM cities'
  );
  return result?.count ?? 0;
}

/**
 * 市区町村を取得（IDで）
 */
export function getCityById(id: string): CityRow | null {
  const db = getDatabase();
  const row = db.getFirstSync<CityRowSQLite>(
    'SELECT * FROM cities WHERE id = ?',
    [id]
  );
  return row ? fromSQLite(row) : null;
}

/**
 * 都道府県別に市区町村を取得
 */
export function getCitiesByPrefecture(prefectureId: string): CityRow[] {
  const db = getDatabase();
  const rows = db.getAllSync<CityRowSQLite>(
    'SELECT * FROM cities WHERE prefecture_id = ? ORDER BY name',
    [prefectureId]
  );
  return rows.map(fromSQLite);
}

/**
 * 全市区町村を取得
 */
export function getAllCities(): CityRow[] {
  const db = getDatabase();
  const rows = db.getAllSync<CityRowSQLite>('SELECT * FROM cities ORDER BY prefecture_id, name');
  return rows.map(fromSQLite);
}

