/**
 * キャッシュ設定
 *
 * TanStack Query と永続化の設定値
 */

// ===============================
// 静的データのキャッシュ設定
// ===============================

/**
 * 静的データ（交通機関、街、市区町村）のキャッシュ設定
 *
 * - staleTime: データの鮮度期間（この間は再取得しない）
 * - gcTime: メモリキャッシュの保持期間（この後メモリから解放）
 * - maxAge: 永続化データの保存期限（AsyncStorageでの保存期間）
 */
export const STATIC_DATA_CACHE_CONFIG = {
  /** データの鮮度（30日） - この間は再取得しない */
  staleTime: 30 * 24 * 60 * 60 * 1000,
  /** メモリキャッシュ保持時間（5分） - この後メモリから解放、永続化には残る */
  gcTime: 5 * 60 * 1000,
  /** 永続化の保存期限（30日） - AsyncStorageでの保存期間 */
  maxAge: 30 * 24 * 60 * 60 * 1000,
} as const;

// ===============================
// LRUキャッシュ設定
// ===============================

/**
 * タイルベースのLRUキャッシュ上限設定
 *
 * machi/cities/transport_hubsはタイル単位でキャッシュし、上限を超えたら古いタイルから削除
 * 各エンティティタイプごとに独立したLRU管理（それぞれ最大50タイル）
 */
export const TILE_CACHE_LIMITS = {
  /** 最大タイル数（各エンティティタイプごと） */
  maxTiles: 50,
} as const;

// ===============================
// 永続化設定
// ===============================

/**
 * 永続化のストレージキー
 */
export const PERSISTER_STORAGE_KEY = 'MACHIKORE_QUERY_CACHE';

/**
 * 動的データ永続化のストレージキー
 */
export const DYNAMIC_PERSISTER_STORAGE_KEY = 'MACHIKORE_DYNAMIC_CACHE';

/**
 * 永続化対象のクエリキープレフィックス（静的データ - 30日保持）
 *
 * これらのプレフィックスを持つクエリのみAsyncStorageに永続化
 *
 * Note:
 * - machi/cities/transport_hubsはSQLiteでタイル単位にキャッシュするため対象外
 */
export const PERSISTED_QUERY_PREFIXES = ['prefectures', 'categories'] as const;

/**
 * 動的データ永続化対象のクエリキープレフィックス（1日保持）
 *
 * オフライン時に前回のデータを表示するため、フィード系データを永続化
 */
export const DYNAMIC_PERSISTED_QUERY_PREFIXES = [
  'maps',           // マップ一覧・詳細
  'spots',          // スポット一覧・詳細
  'popular-maps',   // 人気マップ
  'today-picks-maps', // 今日のおすすめ
  'user',           // ユーザー情報
  'featured-items', // 特集
  'magazines',      // マガジン
  'magazine',       // マガジン詳細
] as const;

/**
 * 動的データの永続化設定
 */
export const DYNAMIC_PERSISTER_CONFIG = {
  /** 永続化の保存期限（1日） */
  maxAge: 24 * 60 * 60 * 1000,
} as const;

// ===============================
// 永続化サイズ制限
// ===============================

/**
 * AsyncStorageに永続化するキャッシュのサイズ上限
 *
 * 上限を超える書き込みは破棄し、既存キャッシュも削除する
 * （肥大化データの残留を防止）
 */
export const PERSISTER_MAX_SIZE = {
  /** 静的データの最大サイズ（1MB） */
  static: 1 * 1024 * 1024,
  /** 動的データの最大サイズ（2MB） */
  dynamic: 2 * 1024 * 1024,
} as const;
