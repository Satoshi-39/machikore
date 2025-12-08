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
// マップズームレベル
// ===============================

export const MAP_ZOOM = {
  /** 地球全体 */
  EARTH: 3,
  /** 国レベル */
  COUNTRY: 5,
  /** 都道府県レベル */
  PREFECTURE: 8,
  /** 市区レベル */
  CITY: 11,
  /** 街レベル（デフォルト） */
  MACHI: 14,
  /** スポット詳細レベル */
  SPOT: 16,
  /** 初期表示（現在地なし） */
  INITIAL: 10,
} as const;

// ===============================
// スポットカテゴリ色
// ===============================

export const SPOT_CATEGORY_COLORS = {
  food: '#F97316', // オレンジ - 飲食店系
  shopping: '#9333EA', // 紫 - ショッピング系
  tourism: '#10B981', // 緑 - 公園・観光地系
  transit: '#3B82F6', // 青 - 交通系
  other: '#A78BFA', // 薄い紫 - その他
} as const;

// ===============================
// ユーザマップテーマカラー（プリセット）
// ===============================

export const USER_MAP_THEME_COLORS = {
  pink: {
    color: '#ec4899',
    label: 'ピンク',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  red: {
    color: '#EF4444',
    label: '赤',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  orange: {
    color: '#F97316',
    label: 'オレンジ',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  yellow: {
    color: '#EAB308',
    label: '黄色',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  green: {
    color: '#22C55E',
    label: '緑',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  blue: {
    color: '#3B82F6',
    label: '青',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  purple: {
    color: '#9333EA',
    label: '紫',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  gray: {
    color: '#6B7280',
    label: 'グレー',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
    useOutlinedIconInDark: true,
  },
  white: {
    color: '#FFFFFF',
    label: '白',
    haloLight: '#374151',
    haloDark: '#374151',
    useOutlinedIconInLight: true,
  },
} as const;

export type UserMapThemeColor = keyof typeof USER_MAP_THEME_COLORS;

export const USER_MAP_THEME_COLOR_LIST = Object.entries(
  USER_MAP_THEME_COLORS
).map(([key, value]) => ({ key: key as UserMapThemeColor, ...value }));

// ===============================
// 地名アイコン設定
// ===============================

export const LOCATION_ICONS = {
  /** 街 */
  MACHI: {
    name: 'storefront' as const,
    color: '#16a34a', // green-600 (secondary.DEFAULT)
    bgColor: 'bg-green-100',
  },
  /** 市区 */
  CITY: {
    name: 'business' as const,
    color: '#ea580c', // orange-600
    bgColor: 'bg-orange-100',
  },
  /** 都道府県 */
  PREFECTURE: {
    name: 'shield' as const,
    color: '#9333ea', // purple-600
    bgColor: 'bg-purple-100',
  },
  /** マスタースポット */
  MASTER_SPOT: {
    name: 'location-outline' as const,
    color: '#3B82F6', // blue-500 (primary.DEFAULT)
    bgColor: 'bg-blue-100',
  },
  /** ユーザースポット */
  USER_SPOT: {
    name: 'location-outline' as const,
    color: '#ec4899', // pink-500
    bgColor: 'bg-pink-100',
  },
  /** 国 */
  COUNTRY: {
    emoji: '🇯🇵',
    bgColor: 'bg-white',
  },
  /** 地球 */
  EARTH: {
    name: 'globe' as const,
    color: '#0284c7', // sky-600
    bgColor: 'bg-sky-100',
  },
} as const;

/** locationTypeからLOCATION_ICONSのキーへのマッピング */
export const LOCATION_TYPE_MAP = {
  machi: 'MACHI',
  city: 'CITY',
  prefecture: 'PREFECTURE',
  country: 'COUNTRY',
  earth: 'EARTH',
  unknown: 'MASTER_SPOT',
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
