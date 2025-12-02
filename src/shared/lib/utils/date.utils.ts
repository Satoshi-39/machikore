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
 * 日付を相対時間形式で表示（例: 3時間前、2日前）
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'たった今';
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;

  return `${date.getMonth() + 1}/${date.getDate()}`;
}
