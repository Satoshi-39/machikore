/**
 * Countries SQLite API
 */

import { getDatabase } from './client';
import type { CountryRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';

// ===============================
// Create
// ===============================

/**
 * 国を一括挿入
 */
export function bulkInsertCountries(countries: CountryRow[]): void {
  const db = getDatabase();

  db.withTransactionSync(() => {
    for (const country of countries) {
      db.runSync(
        `INSERT OR REPLACE INTO countries (
          id, name, name_kana, latitude, longitude, country_code, continent_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          country.id,
          country.name,
          country.name_kana,
          country.latitude,
          country.longitude,
          country.country_code,
          country.continent_id,
          country.created_at,
          country.updated_at,
        ]
      );
    }
  });

  log.info(`[SQLite] ${countries.length}件の国データを挿入`);
}

// ===============================
// Read
// ===============================

/**
 * 国数を取得
 */
export function getCountryCount(): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM countries'
  );
  return result?.count ?? 0;
}

/**
 * 国を取得（IDで）
 */
export function getCountryById(id: string): CountryRow | null {
  const db = getDatabase();
  const result = db.getFirstSync<CountryRow>(
    'SELECT * FROM countries WHERE id = ?',
    [id]
  );
  return result ?? null;
}

/**
 * 国を取得（国コードで）
 */
export function getCountryByCode(countryCode: string): CountryRow | null {
  const db = getDatabase();
  const result = db.getFirstSync<CountryRow>(
    'SELECT * FROM countries WHERE country_code = ?',
    [countryCode]
  );
  return result ?? null;
}

/**
 * 全国を取得
 */
export function getAllCountries(): CountryRow[] {
  const db = getDatabase();
  return db.getAllSync<CountryRow>('SELECT * FROM countries ORDER BY name');
}

/**
 * 大陸IDで国を取得
 */
export function getCountriesByContinent(continentId: string): CountryRow[] {
  const db = getDatabase();
  return db.getAllSync<CountryRow>(
    'SELECT * FROM countries WHERE continent_id = ? ORDER BY name',
    [continentId]
  );
}
