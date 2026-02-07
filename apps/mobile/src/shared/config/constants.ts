/**
 * アプリケーション定数
 */

// ===============================
// アプリ情報
// ===============================

export const APP_NAME = '街コレ';
export const APP_VERSION = '1.0.0';

// ===============================
// 通知
// ===============================

export const NOTIFICATION = {
  /** 通知の保持日数（これより古い通知は表示しない） */
  RETENTION_DAYS: 90,
} as const;

// ===============================
// ページネーション
// ===============================

/** 無限スクロールフィード用のページサイズ（スポット、マップ、いいね一覧等） */
export const FEED_PAGE_SIZE = 10;

/** コメント一覧のページサイズ */
export const COMMENTS_PAGE_SIZE = 20;

/** フォロワー/フォロー中一覧のページサイズ */
export const FOLLOWS_PAGE_SIZE = 20;

// ===============================
// 画像
// ===============================

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/** 画像リサイズ時の最大幅/高さ（px） */
export const MAX_IMAGE_DIMENSION = 1920;

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
// マップズームレベル
// ===============================

/**
 * ジャンプ時のズームレベル（検索結果タップ時など）
 */
export const MAP_ZOOM = {
  /** 地球全体 */
  EARTH: 3,
  /** 国レベル */
  COUNTRY: 4,
  /** 地方レベル */
  REGION: 6,
  /** 都道府県レベル */
  PREFECTURE: 8,
  /** 市区レベル */
  CITY: 11,
  /** 街レベル */
  MACHI: 13,
  /** スポット詳細レベル */
  SPOT: 16,
  /** 初期表示（現在地なし） */
  INITIAL: 10,
} as const;

/**
 * ラベル表示のズームレベル範囲 - デフォルトマップ用
 * min: この値以上のズームでラベルが表示される（minZoomLevel）
 * max: この値以下のズームでラベルが表示される（maxZoomLevel）
 */
export const LABEL_ZOOM_DEFAULT_MAP = {
  /** 国ラベル */
  COUNTRY: { min: 1, max: 4 },
  /** 地方ラベル */
  REGION: { min: 4, max: 7 },
  /** 都道府県ラベル */
  PREFECTURE: { min: 5, max: 11 },
  /** 市区ラベル */
  CITY: { min: 10, max: 12 },
  /** 街ラベル（maxなし = ずっと表示） */
  MACHI: { min: 12 },
} as const;

/**
 * ラベル表示のズームレベル範囲 - ユーザマップ用
 * min: この値以上のズームでラベルが表示される（minZoomLevel）
 * max: この値以下のズームでラベルが表示される（maxZoomLevel）
 */
export const LABEL_ZOOM_USER_MAP = {
  /** 都道府県ラベル */
  PREFECTURE: { min: 5, max: 9 },
  /** 市区ラベル（より広域から表示） */
  CITY: { min: 9, max: 12 },
  /** 交通機関ラベル */
  TRANSPORT: {
    station: { min: 12, max: 22 },
    airport: { min: 9, max: 22 },
    ferry: { min: 12, max: 22 },
    bus: { min: 12, max: 22 },
  },
} as const;

// ===============================
// マップタイル設定
// ===============================

export const MAP_TILE = {
  /** タイルサイズ（度）: 0.25度 ≒ 約25km四方 */
  SIZE: 0.25,
} as const;

// ===============================
// 地名表示の距離しきい値（km）
// ===============================

/**
 * マップ中心座標から最寄りのエンティティまでの距離がこの値を超えた場合、
 * 地名を表示しない（海の上などで誤った地名を表示しないため）
 *
 * フェーズ2でポリゴンデータを導入すれば、より正確な判定が可能
 */
export const MAP_DISTANCE_THRESHOLD = {
  /** 街名を表示する最大距離（km） - 駅周辺の範囲 */
  MACHI: 1.5,
  /** 市区名を表示する最大距離（km） - 市区の中心からの範囲 */
  CITY: 5,
  /** 都道府県名を表示する最大距離（km） - 都道府県の陸地範囲 */
  PREFECTURE: 30,
  /** 地方名を表示する最大距離（km） - 地方は複数の都道府県をカバー */
  REGION: 250,
  /** 国名を表示する最大距離（km） - 日本は南北約3000km、東西約3000kmあるので大きめに */
  COUNTRY: 2000,
} as const;

// ===============================
// スポットタイプ色
// ===============================

export const SPOT_TYPE_COLORS = {
  food: '#F97316', // オレンジ - 飲食店系
  shopping: '#9333EA', // 紫 - ショッピング系
  tourism: '#10B981', // 緑 - 公園・観光地系
  transit: '#3B82F6', // 青 - 交通系
  other: '#A78BFA', // 薄い紫 - その他
  popular: '#F59E0B', // ゴールド - 人気スポット
} as const;

// ===============================
// スポットカラー（プリセット）
// ===============================

export const SPOT_COLORS = {
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

export type SpotColor = keyof typeof SPOT_COLORS;

/** スポットのデフォルトカラー */
export const DEFAULT_SPOT_COLOR: SpotColor = 'blue';

export const SPOT_COLOR_LIST = Object.entries(
  SPOT_COLORS
).map(([key, value]) => ({ key: key as SpotColor, ...value }));

// ===============================
// 交通機関ラベル設定
// ===============================

/** 交通機関タイプ別の色（ライトモード） */
export const TRANSPORT_HUB_COLORS_LIGHT = {
  station_jr: '#0066CC', // 青（JR）
  station_metro: '#06B6D4', // 水色（東京メトロ）
  station_toei: '#22C55E', // 緑（都営）
  station_subway: '#8B5CF6', // 紫（その他地下鉄）
  station_private: '#EC4899', // ピンク（私鉄）
  station_default: '#6B7280', // グレー（不明）
  airport: '#EF4444', // 赤
  ferry_terminal: '#06B6D4', // シアン
  bus_terminal: '#84CC16', // ライムグリーン
} as const;

/** 交通機関タイプ別の色（ダークモード） */
export const TRANSPORT_HUB_COLORS_DARK = {
  station_jr: '#60A5FA', // 明るい青（JR）
  station_metro: '#22D3EE', // 明るい水色（東京メトロ）
  station_toei: '#4ADE80', // 明るい緑（都営）
  station_subway: '#A78BFA', // 明るい紫（その他地下鉄）
  station_private: '#F472B6', // 明るいピンク（私鉄）
  station_default: '#9CA3AF', // 明るいグレー（不明）
  airport: '#F87171', // 明るい赤
  ferry_terminal: '#22D3EE', // 明るいシアン
  bus_terminal: '#A3E635', // 明るいライムグリーン
} as const;

/** 交通機関のデフォルトminZoomLevel（shared/default-map用） */
export const TRANSPORT_HUB_MIN_ZOOM_DEFAULT = {
  station: 13,
  airport: 8,
  ferry: 13,
  bus: 13,
} as const;

/** symbolSortKeyの値（小さいほど優先、同じShapeSource内で有効）- デフォルトマップ用 */
export const SYMBOL_SORT_KEY = {
  machi: 1, // 街は最優先
  spot: 25, // スポットは街の次に優先
  airport: 50, // 空港は次に優先
  station: 100, // 駅
  ferry: 100, // フェリー
  bus: 150, // バス
} as const;

/** symbolSortKeyの値（小さいほど優先、同じShapeSource内で有効）- ユーザマップ用 */
export const SYMBOL_SORT_KEY_USER_MAP = {
  spot: 1, // スポットは最優先
  airport: 50, // 空港
  station: 100, // 駅
  ferry: 100, // フェリー
  bus: 150, // バス
  city: 200, // 市区町村（交通データより低優先度）
  prefecture: 250, // 都道府県（最低優先度）
} as const;

/** 地名ラベルの色（ライトモード）- ユーザマップ用 */
export const LOCATION_LABEL_COLORS_LIGHT = {
  text: '#4B5563', // gray-600
  halo: '#FFFFFF',
} as const;

/** 地名ラベルの色（ダークモード）- ユーザマップ用 */
export const LOCATION_LABEL_COLORS_DARK = {
  text: '#D1D5DB', // gray-300
  halo: '#1F2937', // gray-800
} as const;

/**
 * スポットカラーが縁取りを必要とするかどうかを判定
 * @param spotColor スポットカラー
 * @param isDarkMode ダークモードかどうか
 * @returns 縁取りの色（不要な場合はundefined）
 */
export function getSpotColorStroke(
  spotColor: SpotColor,
  isDarkMode: boolean
): string | undefined {
  const config = SPOT_COLORS[spotColor];
  if (!config) return undefined;

  // ライトモードで縁取りが必要（白）
  if (
    'useOutlinedIconInLight' in config &&
    !isDarkMode &&
    config.useOutlinedIconInLight
  ) {
    return config.haloLight;
  }
  // ダークモードで縁取りが必要（グレー）
  if (
    'useOutlinedIconInDark' in config &&
    isDarkMode &&
    config.useOutlinedIconInDark
  ) {
    return config.haloDark;
  }

  return undefined;
}

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
  /** 地方 */
  REGION: {
    name: 'layers' as const,
    color: '#0891b2', // cyan-600
    bgColor: 'bg-cyan-100',
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
  /** 住所アイコン */
  ADDRESS: {
    color: '#6B7280', // gray-500
    holeColorLight: '#FFFFFF',
    holeColorDark: '#1f2937', // gray-800
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
  region: 'REGION',
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

// ===============================
// サブスクリプション
// ===============================

/** プレミアム機能の有効化フラグ（falseの場合、Paywallは「準備中」表示） */
export const PREMIUM_ENABLED = true;

export const SUBSCRIPTION = {
  /** 無料プランのスポット上限（マップごと） */
  FREE_SPOT_LIMIT: 5,
  /** プレミアムプランのスポット上限（マップごと） */
  PREMIUM_SPOT_LIMIT: 10,
  /** 無料プランの画像上限（スポットごと） */
  FREE_IMAGE_LIMIT: 4,
  /** プレミアムプランの画像上限（スポットごと） */
  PREMIUM_IMAGE_LIMIT: 10,
  /** 無料プランのブックマーク上限（フォルダごと） */
  FREE_BOOKMARKS_PER_FOLDER: 15,
  /** プレミアムプランのブックマーク上限（フォルダごと） */
  PREMIUM_BOOKMARKS_PER_FOLDER: 30,
  /** 無料プランのブックマーク上限（後で見る） */
  FREE_BOOKMARKS_UNCATEGORIZED: 100,
  /** プレミアムプランのブックマーク上限（後で見る） */
  PREMIUM_BOOKMARKS_UNCATEGORIZED: 300,
  /** 無料プランのフォルダ上限 */
  FREE_FOLDER_LIMIT: 10,
  /** プレミアムプランのフォルダ上限 */
  PREMIUM_FOLDER_LIMIT: 30,
  /** 無料プランのコレクション上限 */
  FREE_COLLECTION_LIMIT: 3,
  /** プレミアムプランのコレクション上限 */
  PREMIUM_COLLECTION_LIMIT: 10,
  /** プレミアムプラン月額価格（円）- フォールバック用 */
  PREMIUM_PRICE: 400,
  /** RevenueCat Entitlement ID */
  ENTITLEMENT_ID: 'machikore_premium',
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
// サポートロケール（UI言語）
// ===============================

/**
 * アプリがサポートするUIロケール
 * translate.ts, date.utils.ts などで使用
 */
export const SUPPORTED_LOCALES = ['ja', 'en', 'cn', 'tw'] as const;

/**
 * サポートされるロケールの型
 */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * デフォルトロケール
 */
export const DEFAULT_LOCALE: SupportedLocale = 'ja';

// ===============================
// コンテンツ言語
// ===============================

/**
 * コンテンツ言語の選択肢（フィード/検索結果のフィルタリング用）
 * ISO 639-1コード
 */
export const CONTENT_LANGUAGES = {
  ja: { code: 'ja', label: '日本語', labelEn: 'Japanese' },
  en: { code: 'en', label: '英語', labelEn: 'English' },
  zh: { code: 'zh', label: '中国語', labelEn: 'Chinese' },
  ko: { code: 'ko', label: '韓国語', labelEn: 'Korean' },
} as const;

export type ContentLanguageCode = keyof typeof CONTENT_LANGUAGES;

export const CONTENT_LANGUAGE_LIST = Object.values(CONTENT_LANGUAGES);

// ===============================
// 共有URL
// ===============================

/**
 * 共有用のWebサイトドメイン
 * OGP対応のUniversal Links用
 */
export const SHARE_DOMAIN = 'https://machikore.io';

/**
 * 共有URLを生成
 * URL構造: /{username}/maps/{mapId}/spots/{spotId}
 */
export const SHARE_URLS = {
  /** マップの共有URL */
  map: (username: string, mapId: string) => `${SHARE_DOMAIN}/${username}/maps/${mapId}`,
  /** スポットの共有URL */
  spot: (username: string, mapId: string, spotId: string) => `${SHARE_DOMAIN}/${username}/maps/${mapId}/spots/${spotId}`,
} as const;

// ===============================
// 外部リンク
// ===============================

export const EXTERNAL_LINKS = {
  /** ヘルプ（Notion） */
  HELP: 'https://cobalt-aurora-096.notion.site/2d6b92c6afac80fc8004fa756426ed7f?pvs=74',
  /** 利用規約 */
  TERMS: 'https://machikore.io/terms',
  /** プライバシーポリシー */
  PRIVACY: 'https://machikore.io/privacy',
  /** サポート・お問い合わせ */
  SUPPORT: 'https://machikore.io/support',
} as const;

// ===============================
// ユーザー設定
// ===============================

export const USER_PREFERENCES = {
  /** 好みのカテゴリの最大選択数 */
  MAX_PREFERRED_CATEGORIES: 3,
} as const;

// ===============================
// 検索履歴
// ===============================

export const SEARCH_HISTORY = {
  /** 最大保存件数 */
  MAX_COUNT: 20,
} as const;

// ===============================
// コメント表示
// ===============================

export const COMMENT_DISPLAY = {
  /** スポット詳細カード等でのプレビュー表示件数 */
  PREVIEW_COUNT: 3,
  /** プレビュー表示時のコメント最大文字数 */
  MAX_TEXT_LENGTH: 100,
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

// ===============================
// サムネイル
// ===============================

/**
 * サムネイル画像のアスペクト比
 * OGP/SNSシェア推奨の1.91:1を採用（note/X/Facebook準拠）
 * マップ・スポット共通で使用
 */
export const THUMBNAIL_ASPECT_RATIO = 1.91;

/**
 * 幅からサムネイルの高さを計算するヘルパー関数
 */
export function getThumbnailHeight(width: number): number {
  return Math.round(width / THUMBNAIL_ASPECT_RATIO);
}
