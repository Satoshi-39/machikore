/**
 * アプリレビュー依頼の設定
 *
 * App Store / Google Play のレビュー依頼のタイミングを管理
 *
 * 制限事項:
 * - iOS: StoreKit API により年3回まで
 * - Android: 制限なし（ただし頻繁すぎるとユーザー体験を損なう）
 */

/**
 * レビュー依頼のトリガータイミング
 */
export type ReviewTrigger =
  | 'after_first_post' // 初投稿後
  | 'after_map_created'; // マップ作成後

/**
 * レビュー依頼の設定
 */
export const APP_REVIEW_CONFIG = {
  /**
   * レビュー依頼の最低間隔（日数）
   * iOS は年3回制限があるため、約4ヶ月（120日）間隔を推奨
   */
  minIntervalDays: 120,

  /**
   * トリガー設定
   */
  triggers: {
    /** 初投稿後にレビュー依頼を表示 */
    afterFirstPost: true,
    /** マップ作成後にレビュー依頼を表示 */
    afterMapCreated: true,
  },

  /**
   * AsyncStorageのキー
   */
  storageKeys: {
    /** 最後にレビュー依頼を表示した日時 */
    lastRequestedAt: 'app_review_last_requested_at',
    /** レビュー依頼を表示した回数 */
    requestCount: 'app_review_request_count',
  },
} as const;
