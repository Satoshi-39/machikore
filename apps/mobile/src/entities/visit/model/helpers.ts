/**
 * Visit ビジネスロジック
 */

import { v4 as uuidv4 } from 'uuid';
import type { VisitRow } from '@/shared/types/database.types';
import type { CreateVisitParams } from './types';

// ===============================
// 訪問記録作成
// ===============================

/**
 * 新規訪問記録を作成
 */
export function createVisitData(params: CreateVisitParams): VisitRow {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    user_id: params.userId,
    machi_id: params.stationId,
    visited_at: params.visitedAt || now,
    created_at: now,
    updated_at: now,
  };
}

// ===============================
// バリデーション
// ===============================

/**
 * 訪問記録作成パラメータのバリデーション
 */
export function validateCreateVisitParams(
  params: CreateVisitParams
): { valid: boolean; error?: string } {
  if (!params.userId || params.userId.trim() === '') {
    return { valid: false, error: 'ユーザーIDが必要です' };
  }

  if (!params.stationId || params.stationId.trim() === '') {
    return { valid: false, error: '街IDが必要です' };
  }

  if (params.visitedAt) {
    const date = new Date(params.visitedAt);
    if (isNaN(date.getTime())) {
      return { valid: false, error: '訪問日時が無効です' };
    }

    // 未来の日付をチェック
    if (date > new Date()) {
      return { valid: false, error: '訪問日時は現在より前である必要があります' };
    }
  }

  return { valid: true };
}

// ===============================
// ユーティリティ
// ===============================

/**
 * 訪問日時をフォーマットで取得
 * @param visitedAt - ISO 8601形式の日時文字列
 * @param locale - ロケール（デフォルト: 'ja-JP'）
 */
export function formatVisitDate(
  visitedAt: string,
  locale: string = 'ja-JP'
): string {
  const date = new Date(visitedAt);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * 訪問日時を相対時間で取得
 */
export function getRelativeTime(visitedAt: string): string {
  const now = new Date();
  const visited = new Date(visitedAt);
  const diffInMs = now.getTime() - visited.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'たった今';
  if (diffInMinutes < 60) return `${diffInMinutes}分前`;
  if (diffInHours < 24) return `${diffInHours}時間前`;
  if (diffInDays < 7) return `${diffInDays}日前`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}週間前`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}ヶ月前`;
  return `${Math.floor(diffInDays / 365)}年前`;
}

/**
 * 訪問記録を日付でソート（新しい順）
 */
export function sortVisitsByDate(visits: VisitRow[]): VisitRow[] {
  return [...visits].sort(
    (a, b) =>
      new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime()
  );
}

