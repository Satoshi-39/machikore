/**
 * 入力値制限
 * 全アプリ共通（mobile / web / admin）
 */
export const INPUT_LIMITS = {
  // ユーザー
  USER_DISPLAY_NAME: 50,
  USER_BIO: 200,

  // マップ
  MAP_NAME: 50,
  MAP_DESCRIPTION: 500,
  MAX_SPOTS_PER_MAP: 10,

  // スポット
  SPOT_NAME: 20, // スポット名（現在地/ピン刺し登録用）
  SPOT_ONE_WORD: 30, // このスポットを一言で
  SPOT_SUMMARY: 50, // スポットの概要
  SPOT_ARTICLE_CONTENT: 5000,
  SPOT_ADDRESS: 200,
  MAX_IMAGES_PER_SPOT: 10,

  // タグ
  TAG_NAME: 30,
  MAX_TAGS: 10,

  // コメント
  COMMENT: 500,

  // コレクション
  COLLECTION_NAME: 100,
  COLLECTION_DESCRIPTION: 200,

  // スケジュール
  SCHEDULE_TITLE: 100,
  SCHEDULE_MEMO: 500,

  // 報告
  REPORT_DESCRIPTION: 500,
} as const;
