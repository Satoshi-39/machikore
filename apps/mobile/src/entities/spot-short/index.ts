/**
 * spot-short エンティティ エクスポート
 *
 * FSD原則：Entity層 - ビジネスエンティティとそのデータ取得ロジック
 */

// API hooks
export * from './api';

// 型（shared/api/supabaseから再エクスポート）
export type {
  SpotShortRow,
  SpotShortInsert,
  CreateSpotShortParams,
} from '@/shared/api/supabase';

// アップロード用の型
export type { SelectedVideo } from './api/use-upload-spot-shorts';
