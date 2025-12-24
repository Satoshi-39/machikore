/**
 * Regions SQLite API
 */

import { getDatabase } from './client';
import type { RegionRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';
import { parseJsonField } from '@/shared/lib/utils/json.utils';

// ===============================
// Create
// ===============================

/**
 * 地方を一括挿入
 */
export function bulkInsertRegions(regions: RegionRow[]): void {
  const db = getDatabase();

  db.withTransactionSync(() => {
    for (const region of regions) {
      db.runSync(
        `INSERT OR REPLACE INTO regions (
          id, name, name_kana, name_translations, latitude, longitude, country_id, display_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          region.id,
          region.name,
          region.name_kana,
          typeof region.name_translations === 'string'
            ? region.name_translations
            : JSON.stringify(region.name_translations),
          region.latitude,
          region.longitude,
          region.country_id,
          region.display_order,
          region.created_at,
          region.updated_at,
        ]
      );
    }
  });

  log.info(`[SQLite] ${regions.length}件の地方データを挿入`);
}

// ===============================
// Read
// ===============================

/**
 * 地方数を取得
 */
export function getRegionCount(): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM regions'
  );
  return result?.count ?? 0;
}

/**
 * 地方を取得（IDで）
 */
export function getRegionById(id: string): RegionRow | null {
  const db = getDatabase();
  const result = db.getFirstSync<RegionRow>(
    'SELECT * FROM regions WHERE id = ?',
    [id]
  );
  return result ?? null;
}

/** SQLiteから取得したデータのname_translationsをパース */
function fromSQLiteRegion(row: Record<string, unknown>): RegionRow {
  return {
    ...row,
    name_translations: parseJsonField(row.name_translations as string | null | Record<string, string>),
  } as RegionRow;
}

/**
 * 全地方を取得
 */
export function getAllRegions(): RegionRow[] {
  const db = getDatabase();
  const rows = db.getAllSync<Record<string, unknown>>('SELECT * FROM regions ORDER BY display_order');
  return rows.map(fromSQLiteRegion);
}
