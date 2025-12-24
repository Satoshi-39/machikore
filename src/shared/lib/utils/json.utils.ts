/**
 * JSON関連ユーティリティ
 */

/**
 * JSON文字列をオブジェクトにパース
 * - null/undefinedはnullを返す
 * - 既にオブジェクトの場合はそのまま返す
 * - 文字列の場合はJSONパースを試みる
 *
 * 主にSQLiteから取得したJSONフィールドのパースに使用
 */
export function parseJsonField<T = Record<string, string>>(
  value: string | null | undefined | T
): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return value as T;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return null;
}
