/**
 * MasterSpot エンティティ型定義
 *
 * master_spotは現実世界の場所を表す共有マスターデータ
 * 複数のユーザーが同じmaster_spotを参照可能
 */

import type { MasterSpotRow } from '@/shared/types/database.types';

// ===============================
// Domain Types
// ===============================

/**
 * マスタースポット作成パラメータ
 */
export interface CreateMasterSpotParams {
  name: string;
  latitude: number;
  longitude: number;
  googlePlaceId?: string | null;
  googleFormattedAddress?: string | null;
  googleTypes?: string[] | null;
}

/**
 * マスタースポット検索パラメータ
 */
export interface SearchMasterSpotParams {
  query?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // メートル単位
  limit?: number;
}

// Re-export database types
export type { MasterSpotRow };
