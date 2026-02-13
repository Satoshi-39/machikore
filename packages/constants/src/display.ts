/**
 * 表示・UI設定
 * 全アプリ共通（mobile / web）
 */

export const COMMENT_DISPLAY = {
  /** スポット詳細カード等でのプレビュー表示件数 */
  PREVIEW_COUNT: 3,
  /** プレビュー表示時のコメント最大文字数 */
  MAX_TEXT_LENGTH: 100,
} as const;

export const SEARCH_HISTORY = {
  /** 最大保存件数 */
  MAX_COUNT: 20,
} as const;

export const USER_PREFERENCES = {
  /** 好みのカテゴリの最大選択数 */
  MAX_PREFERRED_CATEGORIES: 3,
} as const;
