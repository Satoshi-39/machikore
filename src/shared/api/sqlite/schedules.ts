/**
 * 予定関連のSQLite操作
 */

import { queryOne, queryAll, execute } from './client';
import type { ScheduleRow } from '@/shared/types/database.types';
import type { UUID } from '@/shared/types';

// ===============================
// 予定取得
// ===============================

/**
 * IDで予定を取得
 */
export function getScheduleById(scheduleId: UUID): ScheduleRow | null {
  return queryOne<ScheduleRow>('SELECT * FROM schedules WHERE id = ?;', [
    scheduleId,
  ]);
}

/**
 * ユーザーの全予定を取得
 */
export function getSchedulesByUserId(userId: UUID): ScheduleRow[] {
  return queryAll<ScheduleRow>(
    'SELECT * FROM schedules WHERE user_id = ? ORDER BY scheduled_at;',
    [userId]
  );
}

/**
 * 特定日の予定を取得
 */
export function getSchedulesByDate(
  userId: UUID,
  date: string
): ScheduleRow[] {
  return queryAll<ScheduleRow>(
    `
    SELECT * FROM schedules
    WHERE user_id = ? AND DATE(scheduled_at) = ?
    ORDER BY scheduled_at;
    `,
    [userId, date]
  );
}

/**
 * 月別予定を取得
 */
export function getSchedulesByMonth(
  userId: UUID,
  year: number,
  month: number
): ScheduleRow[] {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;

  return queryAll<ScheduleRow>(
    `
    SELECT * FROM schedules
    WHERE user_id = ?
      AND scheduled_at >= ?
      AND scheduled_at < ?
    ORDER BY scheduled_at;
    `,
    [userId, startDate, endDate]
  );
}

/**
 * 日付範囲で予定を取得
 */
export function getSchedulesByDateRange(
  userId: UUID,
  startDate: string,
  endDate: string
): ScheduleRow[] {
  return queryAll<ScheduleRow>(
    `
    SELECT * FROM schedules
    WHERE user_id = ?
      AND scheduled_at >= ?
      AND scheduled_at <= ?
    ORDER BY scheduled_at;
    `,
    [userId, startDate, endDate]
  );
}

/**
 * 街IDで予定を取得
 */
export function getSchedulesByMachiId(
  userId: UUID,
  machiId: string
): ScheduleRow[] {
  return queryAll<ScheduleRow>(
    `
    SELECT * FROM schedules
    WHERE user_id = ? AND machi_id = ?
    ORDER BY scheduled_at;
    `,
    [userId, machiId]
  );
}

/** @deprecated Use getSchedulesByMachiId instead */
export function getSchedulesByStationId(
  userId: UUID,
  stationId: string
): ScheduleRow[] {
  return getSchedulesByMachiId(userId, stationId);
}

// ===============================
// 予定作成・更新
// ===============================

/**
 * 予定を作成
 */
export function insertSchedule(schedule: ScheduleRow): void {
  execute(
    `
    INSERT INTO schedules (
      id, user_id, machi_id, scheduled_at, title, memo,
      is_completed, completed_at, created_at, updated_at, synced_at, is_synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      schedule.id,
      schedule.user_id,
      schedule.machi_id,
      schedule.scheduled_at,
      schedule.title,
      schedule.memo,
      schedule.is_completed,
      schedule.completed_at,
      schedule.created_at,
      schedule.updated_at,
      schedule.synced_at,
      schedule.is_synced,
    ]
  );
}

/**
 * 予定を更新
 */
export function updateSchedule(
  scheduleId: UUID,
  data: {
    scheduled_at?: string;
    title?: string;
    memo?: string | null;
    is_completed?: 0 | 1;
    completed_at?: string | null;
    synced_at?: string | null;
    is_synced?: 0 | 1;
    updated_at: string;
  }
): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.scheduled_at !== undefined) {
    fields.push('scheduled_at = ?');
    values.push(data.scheduled_at);
  }

  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }

  if (data.memo !== undefined) {
    fields.push('memo = ?');
    values.push(data.memo);
  }

  if (data.is_completed !== undefined) {
    fields.push('is_completed = ?');
    values.push(data.is_completed);
  }

  if (data.completed_at !== undefined) {
    fields.push('completed_at = ?');
    values.push(data.completed_at);
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

  values.push(scheduleId);

  execute(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ?;`, values);
}

// ===============================
// 予定削除
// ===============================

/**
 * 予定を削除
 */
export function deleteSchedule(scheduleId: UUID): void {
  execute('DELETE FROM schedules WHERE id = ?;', [scheduleId]);
}

/**
 * ユーザーの全予定を削除
 */
export function deleteAllSchedulesByUser(userId: UUID): void {
  execute('DELETE FROM schedules WHERE user_id = ?;', [userId]);
}

/**
 * 街の全予定を削除
 */
export function deleteSchedulesByMachiId(
  userId: UUID,
  machiId: string
): void {
  execute('DELETE FROM schedules WHERE user_id = ? AND machi_id = ?;', [
    userId,
    machiId,
  ]);
}

/** @deprecated Use deleteSchedulesByMachiId instead */
export function deleteSchedulesByStationId(
  userId: UUID,
  stationId: string
): void {
  return deleteSchedulesByMachiId(userId, stationId);
}

// ===============================
// 統計情報
// ===============================

/**
 * ユーザーの総予定数を取得
 */
export function getTotalScheduleCount(userId: UUID): number {
  const result = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM schedules WHERE user_id = ?;',
    [userId]
  );
  return result?.count ?? 0;
}

/**
 * 今後の予定を取得
 */
export function getUpcomingSchedules(
  userId: UUID,
  limit: number
): ScheduleRow[] {
  const today = new Date().toISOString();

  return queryAll<ScheduleRow>(
    `
    SELECT * FROM schedules
    WHERE user_id = ? AND scheduled_at >= ?
    ORDER BY scheduled_at
    LIMIT ?;
    `,
    [userId, today, limit]
  );
}

/**
 * 過去の予定を取得
 */
export function getPastSchedules(userId: UUID, limit: number): ScheduleRow[] {
  const today = new Date().toISOString();

  return queryAll<ScheduleRow>(
    `
    SELECT * FROM schedules
    WHERE user_id = ? AND scheduled_at < ?
    ORDER BY scheduled_at DESC
    LIMIT ?;
    `,
    [userId, today, limit]
  );
}
