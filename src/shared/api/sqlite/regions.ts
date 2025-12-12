/**
 * Regions SQLite API
 */

import { getDatabase } from './client';
import type { RegionRow } from '@/shared/types/database.types';

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
          id, name, name_kana, name_translations, latitude, longitude, country_code, display_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          region.id,
          region.name,
          region.name_kana,
          region.name_translations,
          region.latitude,
          region.longitude,
          region.country_code,
          region.display_order,
          region.created_at,
          region.updated_at,
        ]
      );
    }
  });

  console.log(`✅ ${regions.length}件の地方データを挿入`);
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

/**
 * 全地方を取得
 */
export function getAllRegions(): RegionRow[] {
  const db = getDatabase();
  return db.getAllSync<RegionRow>('SELECT * FROM regions ORDER BY display_order');
}
