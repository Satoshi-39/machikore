/**
 * 共通型定義
 */

// ===============================
// 基本型
// ===============================

export type UUID = string;
export type ISO8601DateTime = string;

// ===============================
// ステータス型
// ===============================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type SubscriptionTier = 'free' | 'premium';

// ===============================
// 結果型（Result Pattern）
// ===============================

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ===============================
// API Response
// ===============================

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// ===============================
// 訪問回数アイコン
// ===============================

export type VisitCount = 1 | 2 | 3;

export type VisitIconType =
  | 'unvisited' // 未訪問
  | 'first' // 1回目
  | 'second' // 2回目
  | 'multiple'; // 3回以上

// ===============================
// Mapbox関連型
// ===============================

/**
 * Mapbox ShapeSourceのonPressイベント型
 * @rnmapbox/maps の内部型を再定義
 */
export interface MapboxOnPressEvent {
  features: Array<GeoJSON.Feature>;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  point: {
    x: number;
    y: number;
  };
}
