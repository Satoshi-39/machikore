/**
 * Visit エンティティ型定義
 */

import type { VisitRow, MachiRow } from '@/shared/types/database.types';

// ===============================
// Domain Types
// ===============================

/**
 * 街情報付き訪問記録
 */
export interface VisitWithStation extends VisitRow {
  station?: MachiRow;
}

/**
 * 訪問記録作成パラメータ
 */
export interface CreateVisitParams {
  userId: string;
  stationId: string;
  visitedAt?: string; // デフォルトは現在時刻
}

/**
 * 訪問記録更新パラメータ
 */
export interface UpdateVisitParams {
  visitId: string;
  visitedAt?: string;
}

/**
 * 訪問トグルパラメータ
 */
export interface ToggleVisitParams {
  userId: string;
  machiId: string;
  visitedAt?: string; // デフォルトは現在時刻
}

/**
 * 訪問統計情報
 */
export interface VisitStats {
  totalStations: number; // 総訪問街数
  thisMonthVisits: number; // 今月の訪問街数
  recentVisits: VisitRow[]; // 最近の訪問記録
}
