/**
 * Schedule エンティティ型定義
 */

import type { ScheduleRow, MachiRow } from '@/shared/types/database.types';

// ===============================
// Domain Types
// ===============================

/**
 * 街情報付き予定
 */
export interface ScheduleWithStation extends ScheduleRow {
  station?: MachiRow;
}

/**
 * 予定作成パラメータ
 */
export interface CreateScheduleParams {
  userId: string;
  stationId: string;
  scheduledAt: string; // ISO8601形式
  title: string;
  memo?: string;
}

/**
 * 予定更新パラメータ
 */
export interface UpdateScheduleParams {
  scheduleId: string;
  scheduledAt?: string;
  title?: string;
  memo?: string | null;
  isCompleted?: boolean;
}
