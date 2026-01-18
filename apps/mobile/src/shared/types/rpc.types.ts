/**
 * RPC関数の戻り値型定義
 *
 * Supabase RPC関数から返されるデータの型
 * MergeDeepでSupabase生成型を拡張（database.types.tsと同じパターン）
 */

import type { MergeDeep } from 'type-fest';
import type { Database } from './database.types';

// Supabase生成型のCompositeType
type MixedFeedItemGenerated = Database['public']['CompositeTypes']['mixed_feed_item'];

/**
 * get_mixed_feed / get_following_mixed_feed RPC関数の戻り値（1行分）
 *
 * UNION ALLで統合されるため、マップ/スポット両方のフィールドを持つ
 * item_typeで判別し、該当しない方のフィールドはnull
 *
 * Supabase生成型では全フィールドがnullableだが、
 * item_type, item_id, created_atは必ず値が入るため上書き
 */
export type RpcMixedFeedItem = MergeDeep<
  MixedFeedItemGenerated,
  {
    // 共通フィールド（必ず値が入る）
    item_type: string; // 'map' | 'spot'
    item_id: string;
    created_at: string;
  }
>;
