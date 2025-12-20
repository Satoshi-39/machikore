/**
 * Schedule ビジネスロジック
 */

import { v4 as uuidv4 } from 'uuid';
import type { ScheduleRow } from '@/shared/types/database.types';
import type { CreateScheduleParams } from './types';

// ===============================
// 予定作成
// ===============================

/**
 * 新規予定データを作成
 */
export function createScheduleData(params: CreateScheduleParams): ScheduleRow {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    user_id: params.userId,
    machi_id: params.stationId,
    scheduled_at: params.scheduledAt,
    title: params.title,
    memo: params.memo || null,
    is_completed: false,
    completed_at: null,
    created_at: now,
    updated_at: now,
  };
}

// ===============================
// バリデーション
// ===============================

/**
 * 予定作成パラメータのバリデーション
 */
export function validateCreateScheduleParams(
  params: CreateScheduleParams
): { valid: boolean; error?: string } {
  if (!params.userId || params.userId.trim() === '') {
    return { valid: false, error: 'ユーザーIDが必要です' };
  }

  if (!params.stationId || params.stationId.trim() === '') {
    return { valid: false, error: '街IDが必要です' };
  }

  if (!params.title || params.title.trim() === '') {
    return { valid: false, error: 'タイトルが必要です' };
  }

  if (params.title.length > 100) {
    return { valid: false, error: 'タイトルは100文字以内にしてください' };
  }

  const scheduledDate = new Date(params.scheduledAt);
  if (isNaN(scheduledDate.getTime())) {
    return { valid: false, error: '予定日時が無効です' };
  }

  return { valid: true };
}

// ===============================
// フォーマット
// ===============================

/**
 * 予定日時を日本語フォーマットで取得
 */
export function formatScheduleDate(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * 予定日時を短縮フォーマットで取得
 */
export function formatScheduleDateShort(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * 日付のみを取得（YYYY-MM-DD）
 */
export function getScheduleDateOnly(scheduledAt: string): string {
  return scheduledAt.split('T')[0] || scheduledAt;
}

// ===============================
// ユーティリティ
// ===============================

/**
 * 予定が今日かどうかチェック
 */
export function isToday(scheduledAt: string): boolean {
  const today = new Date();
  const scheduled = new Date(scheduledAt);

  return (
    today.getFullYear() === scheduled.getFullYear() &&
    today.getMonth() === scheduled.getMonth() &&
    today.getDate() === scheduled.getDate()
  );
}

/**
 * 予定が過去かどうかチェック
 */
export function isPast(scheduledAt: string): boolean {
  return new Date(scheduledAt) < new Date();
}

/**
 * 予定が未来かどうかチェック
 */
export function isFuture(scheduledAt: string): boolean {
  return new Date(scheduledAt) > new Date();
}

/**
 * 予定を日付でソート（近い順）
 */
export function sortSchedulesByDate(schedules: ScheduleRow[]): ScheduleRow[] {
  return [...schedules].sort(
    (a, b) =>
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );
}

/**
 * 完了済み予定のみフィルタ
 */
export function filterCompletedSchedules(
  schedules: ScheduleRow[]
): ScheduleRow[] {
  return schedules.filter((schedule) => schedule.is_completed);
}

/**
 * 未完了予定のみフィルタ
 */
export function filterIncompleteSchedules(
  schedules: ScheduleRow[]
): ScheduleRow[] {
  return schedules.filter((schedule) => !schedule.is_completed);
}
