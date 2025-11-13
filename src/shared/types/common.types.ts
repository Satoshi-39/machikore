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

// Note: SyncStatus は sync.types.ts に定義されています

export type SubscriptionTier = 'free' | 'premium';

// ===============================
// 結果型（Result Pattern）
// ===============================

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ===============================
// ページネーション
// ===============================

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

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
