/**
 * 訪問記録関連のSQLite操作
 */

import { queryOne, queryAll, execute } from './client';
import type { VisitRow } from '@/shared/types/database.types';
import type { UUID } from '@/shared/types';

// ===============================
// 訪問記録取得
// ===============================

/**
 * IDで訪問記録を取得
 */
export function getVisitById(visitId: UUID): VisitRow | null {
  return queryOne<VisitRow>('SELECT * FROM visits WHERE id = ?;', [visitId]);
}

/**
 * ユーザーの全訪問記録を取得
 */
export function getVisitsByUserId(userId: UUID): VisitRow[] {
  return queryAll<VisitRow>(
    'SELECT * FROM visits WHERE user_id = ? ORDER BY visited_at DESC;',
    [userId]
  );
}

/**
 * ユーザーと街IDで訪問記録を取得
 */
export function getVisitByUserAndMachi(
  userId: UUID,
  machiId: string
): VisitRow | null {
  return queryOne<VisitRow>(
    'SELECT * FROM visits WHERE user_id = ? AND machi_id = ?;',
    [userId, machiId]
  );
}

/**
 * ユーザーの訪問記録をページネーションで取得
 */
export function getVisitsPaginated(
  userId: UUID,
  limit: number,
  offset: number
): VisitRow[] {
  return queryAll<VisitRow>(
    `
    SELECT * FROM visits
    WHERE user_id = ?
    ORDER BY visited_at DESC
    LIMIT ? OFFSET ?;
    `,
    [userId, limit, offset]
  );
}

/**
 * 街の訪問済み状態をチェック
 */
export function checkMachiVisited(userId: UUID, machiId: string): boolean {
  const result = queryOne<{ id: string }>(
    'SELECT id FROM visits WHERE user_id = ? AND machi_id = ?;',
    [userId, machiId]
  );
  return !!result;
}

/**
 * ユーザーの総訪問街数を取得
 */
export function getTotalVisitedMachiCount(userId: UUID): number {
  const result = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM visits WHERE user_id = ?;',
    [userId]
  );
  return result?.count ?? 0;
}

/** @deprecated Use getTotalVisitedMachiCount instead */
export const getTotalVisitedStationCount = getTotalVisitedMachiCount;

// ===============================
// 訪問記録作成・更新
// ===============================

/**
 * 訪問記録を作成
 */
export function insertVisit(visit: VisitRow): void {
  execute(
    `
    INSERT INTO visits (
      id, user_id, machi_id, visited_at,
      created_at, updated_at, synced_at, is_synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      visit.id,
      visit.user_id,
      visit.machi_id,
      visit.visited_at,
      visit.created_at,
      visit.updated_at,
      visit.synced_at,
      visit.is_synced,
    ]
  );
}

/**
 * 訪問記録を更新
 */
export function updateVisit(
  visitId: UUID,
  data: {
    visited_at?: string;
    synced_at?: string | null;
    is_synced?: 0 | 1;
    updated_at: string;
  }
): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.visited_at !== undefined) {
    fields.push('visited_at = ?');
    values.push(data.visited_at);
  }

  if (data.synced_at !== undefined) {
    fields.push('synced_at = ?');
    values.push(data.synced_at);
  }

  if (data.is_synced !== undefined) {
    fields.push('is_synced = ?');
    values.push(data.is_synced);
  }

  fields.push('updated_at = ?');
  values.push(data.updated_at);

  values.push(visitId);

  execute(`UPDATE visits SET ${fields.join(', ')} WHERE id = ?;`, values);
}


// ===============================
// 訪問記録削除
// ===============================

/**
 * 訪問記録を削除
 */
export function deleteVisit(visitId: UUID): void {
  execute('DELETE FROM visits WHERE id = ?;', [visitId]);
}

/**
 * ユーザーの全訪問記録を削除
 */
export function deleteAllVisitsByUser(userId: UUID): void {
  execute('DELETE FROM visits WHERE user_id = ?;', [userId]);
}

// ===============================
// 統計情報
// ===============================

/**
 * 月別訪問街数を取得
 */
export function getMonthlyVisitStats(
  userId: UUID,
  year: number,
  month: number
): number {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;

  const result = queryOne<{ count: number }>(
    `
    SELECT COUNT(*) as count
    FROM visits
    WHERE user_id = ?
      AND visited_at >= ?
      AND visited_at < ?;
    `,
    [userId, startDate, endDate]
  );

  return result?.count ?? 0;
}

/**
 * 最近の訪問記録を取得
 */
export function getRecentVisits(userId: UUID, limit: number): VisitRow[] {
  return queryAll<VisitRow>(
    `
    SELECT * FROM visits
    WHERE user_id = ?
    ORDER BY visited_at DESC
    LIMIT ?;
    `,
    [userId, limit]
  );
}
