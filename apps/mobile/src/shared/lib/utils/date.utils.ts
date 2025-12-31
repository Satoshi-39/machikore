/**
 * 日付ユーティリティ関数
 *
 * 日付操作に関する汎用的な関数
 */

import { i18n } from '../i18n/i18n';

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換（UTC）
 * @deprecated Use formatLocalDateKey instead for local timezone
 */
export function formatDateKey(date: Date): string {
  const isoString = date.toISOString();
  const dateKey = isoString.split('T')[0];
  if (!dateKey) {
    throw new Error('Invalid date format');
  }
  return dateKey;
}

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換（ローカルタイムゾーン）
 */
export function formatLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 2つの日付が同じ日かどうかを判定（ローカルタイムゾーン）
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatLocalDateKey(date1) === formatLocalDateKey(date2);
}

/**
 * 月の日数を取得
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 月の最初の日の曜日を取得（0: 日曜日, 6: 土曜日）
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * 日付を日本語形式で表示（例: 2025年1月1日）
 */
export function formatJapaneseDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 日付を相対時間形式で表示
 * - 1分未満: たった今
 * - 1時間未満: X分前
 * - 24時間未満: X時間前
 * - 7日未満: X日前
 * - 7日以上: 日付表示（例: 2025年1月1日）
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return i18n.t('time.justNow');
  if (diffMins < 60) return i18n.t('time.minutesAgo', { count: diffMins });
  if (diffHours < 24) return i18n.t('time.hoursAgo', { count: diffHours });
  if (diffDays < 7) return i18n.t('time.daysAgo', { count: diffDays });

  // 7日以上は日付表示（ロケールに応じたフォーマット）
  return formatLocalizedDate(date);
}

/**
 * 日付をロケールに応じた形式で表示（時間なし）
 * - ja: 2025年1月1日
 * - en: Jan 1, 2025
 * - cn/tw: 2025年1月1日
 */
export function formatLocalizedDate(date: Date): string {
  const locale = i18n.locale;

  if (locale === 'en') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // ja, cn, tw は日本語形式
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
