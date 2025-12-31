/**
 * ユーザーバリデーション
 *
 * ユーザー名・表示名などのバリデーションロジック
 */

/**
 * ユーザー名バリデーションエラーキー
 */
export type UsernameValidationError =
  | 'usernameRequired'
  | 'usernameTooShort'
  | 'usernameTooLong'
  | 'usernameInvalid';

/**
 * ユーザー名のバリデーション
 * @param username - 検証するユーザー名
 * @returns エラーキー（エラーがない場合はnull）
 */
export function validateUsername(username: string): UsernameValidationError | null {
  if (!username) return 'usernameRequired';
  if (username.length < 3) return 'usernameTooShort';
  if (username.length > 20) return 'usernameTooLong';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'usernameInvalid';
  return null;
}

/**
 * ユーザー名を正規化（小文字化、不正文字除去）
 * @param text - 入力テキスト
 * @returns 正規化されたユーザー名
 */
export function sanitizeUsername(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9_]/g, '');
}

/**
 * 表示名のバリデーション
 * @param displayName - 検証する表示名
 * @returns エラーがある場合はtrue
 */
export function isDisplayNameEmpty(displayName: string): boolean {
  return !displayName.trim();
}
