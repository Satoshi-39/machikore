/**
 * 日付ユーティリティ関数
 *
 * 日付操作に関する汎用的な関数
 */

import { type SupportedLocale, DEFAULT_LOCALE } from '@/shared/config/constants';

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
 * 相対時間のテキストを取得（ロケール別）
 */
type RelativeTimeKey = 'justNow' | 'minutesAgo' | 'hoursAgo' | 'daysAgo';

function getRelativeTimeText(
  key: RelativeTimeKey,
  count: number,
  locale: SupportedLocale
): string {
  const texts: Record<SupportedLocale, Record<RelativeTimeKey, string>> = {
    ja: {
      justNow: 'たった今',
      minutesAgo: `${count}分前`,
      hoursAgo: `${count}時間前`,
      daysAgo: `${count}日前`,
    },
    en: {
      justNow: 'Just now',
      minutesAgo: count === 1 ? '1 minute ago' : `${count} minutes ago`,
      hoursAgo: count === 1 ? '1 hour ago' : `${count} hours ago`,
      daysAgo: count === 1 ? '1 day ago' : `${count} days ago`,
    },
    cn: {
      justNow: '刚刚',
      minutesAgo: `${count}分钟前`,
      hoursAgo: `${count}小时前`,
      daysAgo: `${count}天前`,
    },
    tw: {
      justNow: '剛剛',
      minutesAgo: `${count}分鐘前`,
      hoursAgo: `${count}小時前`,
      daysAgo: `${count}天前`,
    },
  };
  return texts[locale][key];
}

/**
 * 日付を相対時間形式で表示
 * - 1分未満: たった今
 * - 1時間未満: X分前
 * - 24時間未満: X時間前
 * - 7日未満: X日前
 * - 7日以上: 日付表示（例: 2025年1月1日）
 *
 * @param dateString - ISO 8601形式の日時文字列
 * @param locale - ロケール（デフォルト: 'ja'）
 */
export function formatRelativeTime(
  dateString: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return getRelativeTimeText('justNow', 0, locale);
  if (diffMins < 60) return getRelativeTimeText('minutesAgo', diffMins, locale);
  if (diffHours < 24) return getRelativeTimeText('hoursAgo', diffHours, locale);
  if (diffDays < 7) return getRelativeTimeText('daysAgo', diffDays, locale);

  // 7日以上は日付表示（ロケールに応じたフォーマット）
  return formatLocalizedDate(date, locale);
}

/**
 * 日付をロケールに応じた形式で表示（時間なし）
 * - ja: 2025年1月1日
 * - en: Jan 1, 2025
 * - cn/tw: 2025年1月1日
 *
 * @param date - Date オブジェクト
 * @param locale - ロケール（デフォルト: 'ja'）
 */
export function formatLocalizedDate(
  date: Date,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
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
