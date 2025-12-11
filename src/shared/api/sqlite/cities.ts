/**
 * Cities SQLite API
 */

import { getDatabase } from './client';
import type { CityRow } from '@/shared/types/database.types';

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
      db.runSync(
        `INSERT OR REPLACE INTO cities (
          id, prefecture_id, name, name_kana, name_translations, type, latitude, longitude, tile_id, country_code, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          city.id,
          city.prefecture_id,
          city.name,
          city.name_kana,
          city.name_translations,
          city.type,
          city.latitude,
          city.longitude,
          city.tile_id,
          city.country_code,
          city.created_at,
          city.updated_at,
        ]
      );
    }
  });

  console.log(`✅ ${cities.length}件の市区町村データを挿入`);
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
  const result = db.getFirstSync<CityRow>(
    'SELECT * FROM cities WHERE id = ?',
    [id]
  );
  return result ?? null;
}

/**
 * 都道府県別に市区町村を取得
 */
export function getCitiesByPrefecture(prefectureId: string): CityRow[] {
  const db = getDatabase();
  return db.getAllSync<CityRow>(
    'SELECT * FROM cities WHERE prefecture_id = ? ORDER BY name',
    [prefectureId]
  );
}

/**
 * 全市区町村を取得
 */
export function getAllCities(): CityRow[] {
  const db = getDatabase();
  return db.getAllSync<CityRow>('SELECT * FROM cities ORDER BY prefecture_id, name');
}

