/**
 * ViewHistory エンティティ型定義
 */

import type { MapWithUser } from '@/shared/types';

/**
 * 閲覧履歴レコード（Supabase/SQLiteの行データ）
 */
export interface ViewHistoryRow {
  id: string;
  user_id: string;
  map_id: string;
  viewed_at: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * マップ情報付き閲覧履歴
 */
export interface ViewHistoryWithMap extends ViewHistoryRow {
  map: MapWithUser;
}

/**
 * 閲覧記録パラメータ
 */
export interface RecordViewParams {
  mapId: string;
}
