/**
 * URL関連のユーティリティ関数
 */

/**
 * 有効なHTTP/HTTPS URLかどうかを判定
 */
export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
