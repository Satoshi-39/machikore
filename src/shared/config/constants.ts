/**
 * アプリケーション定数
 */

// ===============================
// アプリ情報
// ===============================

export const APP_NAME = '街コレ';
export const APP_VERSION = '1.0.0';

// ===============================
// ページネーション
// ===============================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ===============================
// 画像
// ===============================

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

// ===============================
// 投稿
// ===============================

export const MAX_POST_LENGTH = 500;
export const MIN_POST_LENGTH = 1;

// ===============================
// キャッシュ
// ===============================

export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000, // 5分
  MEDIUM: 30 * 60 * 1000, // 30分
  LONG: 24 * 60 * 60 * 1000, // 24時間
} as const;

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
// マップマーカー設定
// ===============================

export const MAP_MARKER = {
  // 街マーカーアイコン（絵文字）
  MACHI: {
    VISITED: '🏠',
    UNVISITED: '🏘️',
    VISITED_HIGHLIGHT: '⭐',
  },
  // マーカーサイズ
  SIZE: {
    DEFAULT: 24,
    HIGHLIGHT: 32,
  },
  // マーカー色
  COLOR: {
    DEFAULT: '#000000',
    VISITED_HIGHLIGHT: '#3B82F6', // blue-500
    UNVISITED_HIGHLIGHT: '#6B7280', // gray-500
  },
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
// 入力値制限
// ===============================

export const INPUT_LIMITS = {
  // ユーザー
  USER_DISPLAY_NAME: 50,
  USER_BIO: 200,

  // マップ
  MAP_NAME: 50,
  MAP_DESCRIPTION: 200,
  MAX_SPOTS_PER_MAP: 100,

  // スポット
  SPOT_NAME: 50,
  SPOT_DESCRIPTION: 200,
  SPOT_ADDRESS: 200,
  MAX_IMAGES_PER_SPOT: 4,

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
} as const;
