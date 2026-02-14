/**
 * アプリケーション定数
 *
 * @machikore/constants（SSoT）からre-export + モバイル固有の定数
 */

// ===============================
// @machikore/constants からre-export（SSoT）
// ===============================

// 入力値制限
export { INPUT_LIMITS } from '@machikore/constants';

// サブスクリプション
export { PREMIUM_ENABLED, SUBSCRIPTION } from '@machikore/constants';

// マップ設定
export {
  MAP_ZOOM,
  LABEL_ZOOM_DEFAULT_MAP,
  LABEL_ZOOM_USER_MAP,
  MAP_TILE,
  MAP_DISTANCE_THRESHOLD,
  MAP_MARKER,
} from '@machikore/constants';

// スポット設定
export {
  SPOT_TYPE_COLORS,
  SPOT_COLORS,
  DEFAULT_SPOT_COLOR,
  SPOT_COLOR_LIST,
  getSpotColorStroke,
  type SpotColor,
} from '@machikore/constants';

// 交通機関設定
export {
  TRANSPORT_HUB_COLORS_LIGHT,
  TRANSPORT_HUB_COLORS_DARK,
  TRANSPORT_HUB_MIN_ZOOM_DEFAULT,
  SYMBOL_SORT_KEY,
  SYMBOL_SORT_KEY_USER_MAP,
} from '@machikore/constants';

// 地名表示設定
export {
  LOCATION_ICONS,
  LOCATION_TYPE_MAP,
  LOCATION_LABEL_COLORS_LIGHT,
  LOCATION_LABEL_COLORS_DARK,
} from '@machikore/constants';

// 画像・サムネイル設定
export {
  MAX_IMAGE_SIZE,
  SUPPORTED_IMAGE_FORMATS,
  MAX_IMAGE_DIMENSION,
  THUMBNAIL_ASPECT_RATIO,
  getThumbnailHeight,
} from '@machikore/constants';

// ページネーション設定
export {
  FEED_PAGE_SIZE,
  COMMENTS_PAGE_SIZE,
  FOLLOWS_PAGE_SIZE,
  SEARCH_PAGE_SIZE,
  LIKERS_PAGE_SIZE,
} from '@machikore/constants';

// 国際化・言語設定
export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  CONTENT_LANGUAGES,
  CONTENT_LANGUAGE_LIST,
  type SupportedLocale,
  type ContentLanguageCode,
} from '@machikore/constants';

// 共有URL・外部リンク設定
export { SHARE_DOMAIN, SHARE_URLS, EXTERNAL_LINKS } from '@machikore/constants';

// 表示・UI設定
export { COMMENT_DISPLAY, SEARCH_HISTORY, USER_PREFERENCES } from '@machikore/constants';

// ===============================
// モバイル固有の定数
// ===============================

export const APP_NAME = '街コレ';

// ===============================
// 通知
// ===============================

export const NOTIFICATION = {
  /** 通知の保持日数（これより古い通知は表示しない） */
  RETENTION_DAYS: 90,
} as const;

// ===============================
// ページネーション（モバイル固有）
// ===============================

/** 通知一覧のページサイズ */
export const NOTIFICATIONS_PAGE_SIZE = 20;

/**
 * Infinite Query のメモリ保持ページ数上限
 *
 * maxPages を設定することで、古いページをメモリから解放し、
 * 長時間の無限スクロールによるメモリ蓄積を防ぐ
 */
export const MAX_PAGES = {
  /** フィード系（マップ、スポット、ブックマーク、都道府県スポット等） */
  FEED: 3,
  /** 検索結果（マップ検索、スポット検索、ユーザー検索） */
  SEARCH: 3,
  /** コメント・返信 */
  COMMENTS: 3,
  /** いいねユーザー一覧 */
  LIKERS: 3,
  /** フォロー・フォロワー一覧 */
  FOLLOWS: 5,
  /** 通知一覧 */
  NOTIFICATIONS: 5,
} as const;

/** プリフェッチ済みアイテムの追跡上限（フィードのメモリ保持量に合わせた値） */
export const MAX_PREFETCH_CACHE = 50;

// ===============================
// 投稿
// ===============================

export const MAX_POST_LENGTH = 500;
export const MIN_POST_LENGTH = 1;

// ===============================
// 同期
// ===============================

export const SYNC_RETRY_LIMIT = 3;
export const SYNC_RETRY_DELAY = 1000; // 1秒

// ===============================
// ストレージキー
// ===============================

export const STORAGE_KEYS = {
  // USER_SESSION は Supabase が自動管理するため削除
  // Supabaseクライアントが SecureStorageAdapter を使用してセッションを保存
  UI_STATE: 'ui-storage',
  USER_STATE: 'user-storage',
  POST_STATE: 'post-storage',
  APP_SETTINGS: 'app-settings-storage',
  TUTORIAL: 'tutorial-storage',
  /** ユーザー設定（テーマ・言語）- 未ログイン時のローカル保存用 */
  USER_PREFERENCES: '@machikore/user-preferences',
} as const;

// ===============================
// 訪問アイコン
// ===============================

export const VISIT_ICONS = {
  UNVISITED: '📍',
  FIRST: '✅',
  SECOND: '⭐️',
  MULTIPLE: '🏆',
} as const;

// ===============================
// タブ名
// ===============================

export const TAB_NAMES = {
  MAP: 'map',
  THREAD: 'thread',
  CREATE: 'create',
  CALENDAR: 'calendar',
  MYPAGE: 'mypage',
} as const;

// ===============================
// エラーコード
// ===============================

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SYNC_ERROR: 'SYNC_ERROR',
} as const;

// ===============================
// 特集カルーセル
// ===============================

export const FEATURED_CAROUSEL = {
  /** カード幅の割合（画面幅に対する比率） */
  CARD_WIDTH_RATIO: 0.82,
  /** カードの高さ */
  CARD_HEIGHT: 160,
  /** カード間のギャップ */
  CARD_GAP: 10,
} as const;

// ===============================
// 混合フィード
// ===============================

/**
 * 混合フィードの設定
 * 配置: map×2 → feed_native → map×2 → spot×4(carousel_video含む) → 繰り返し
 * 1ブロック = 10アイテム（広告あり）
 */
export const MIXED_FEED = {
  /** マップの取得件数（1ページあたり = 1ブロック） */
  MAP_LIMIT: 4,
  /** スポットの取得件数（1ページあたり = 1ブロック） */
  SPOT_LIMIT: 4,
  /** 1ブロックあたりのマップ数 */
  MAPS_PER_BLOCK: 4,
  /** 1ブロックあたりのスポット数 */
  SPOTS_PER_BLOCK: 4,
  /** 1ブロックあたりのアイテム数（広告あり: map2 + ad1 + map2 + spot4 + ad1 = 10） */
  ITEMS_PER_BLOCK_WITH_ADS: 10,
  /** 1ブロックあたりのアイテム数（広告なし: map4 + spot4 = 8） */
  ITEMS_PER_BLOCK_WITHOUT_ADS: 8,
} as const;

/** 広告スロット名 */
export const AD_SLOTS = {
  /** フィード内ネイティブ広告（マップの後） */
  FEED_NATIVE: 'feed_native',
  /** カルーセル内動画広告（スポットの間） */
  CAROUSEL_VIDEO: 'carousel_video',
} as const;

export type AdSlot = (typeof AD_SLOTS)[keyof typeof AD_SLOTS];
