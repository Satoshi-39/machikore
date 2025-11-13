/**
 * 日付ユーティリティ関数
 *
 * 日付操作に関する汎用的な関数
 */

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
 * 2つの日付が同じ日かどうかを判定
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateKey(date1) === formatDateKey(date2);
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
