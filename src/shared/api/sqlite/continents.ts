/**
 * Continents SQLite API
 */

import { getDatabase } from './client';
import type { ContinentRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';

// ===============================
// Create
// ===============================

/**
 * 大陸を一括挿入
 */
export function bulkInsertContinents(continents: ContinentRow[]): void {
  const db = getDatabase();

  db.withTransactionSync(() => {
    for (const continent of continents) {
      db.runSync(
        `INSERT OR REPLACE INTO continents (
          id, name, name_en, display_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          continent.id,
          continent.name,
          continent.name_en,
          continent.display_order,
          continent.created_at,
          continent.updated_at,
        ]
      );
    }
  });

  log.info(`[SQLite] ${continents.length}件の大陸データを挿入`);
}

// ===============================
// Read
// ===============================

/**
 * 大陸数を取得
 */
export function getContinentCount(): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM continents'
  );
  return result?.count ?? 0;
}

/**
 * 大陸を取得（IDで）
 */
export function getContinentById(id: string): ContinentRow | null {
  const db = getDatabase();
  const result = db.getFirstSync<ContinentRow>(
    'SELECT * FROM continents WHERE id = ?',
    [id]
  );
  return result ?? null;
}

/**
 * 全大陸を取得（表示順でソート）
 */
export function getAllContinents(): ContinentRow[] {
  const db = getDatabase();
  return db.getAllSync<ContinentRow>('SELECT * FROM continents ORDER BY display_order');
}
