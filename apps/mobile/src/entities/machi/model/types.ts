/**
 * Machi エンティティ型定義
 */

import type { MachiRow } from '@/shared/types/database.types';

// ===============================
// Domain Types
// ===============================

/**
 * 街の訪問状態
 */
export type MachiVisitStatus = 'unvisited' | 'first' | 'second' | 'multiple';

/**
 * 訪問情報付き街データ
 */
export interface MachiWithVisitInfo extends MachiRow {
  visitStatus: MachiVisitStatus;
  visitCount: number;
  lastVisitedAt?: string;
}

/**
 * 街の距離情報
 */
export interface MachiDistance {
  machi: MachiRow;
  distance: number; // km
}

/**
 * 街検索フィルター
 */
export interface MachiFilter {
  name?: string;
  lineName?: string;
  prefecture?: string;
}

// ===============================
// 後方互換性エイリアス（廃止予定）
// ===============================

/** @deprecated Use MachiRow instead */
export type StationRow = MachiRow;
/** @deprecated Use MachiVisitStatus instead */
export type StationVisitStatus = MachiVisitStatus;
/** @deprecated Use MachiWithVisitInfo instead */
export type StationWithVisitInfo = MachiWithVisitInfo;
/** @deprecated Use MachiDistance instead */
export type StationDistance = MachiDistance;
/** @deprecated Use MachiFilter instead */
export type StationFilter = MachiFilter;
