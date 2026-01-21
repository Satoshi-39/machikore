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
 * 必須フィールドは値が入るため上書き
 *
 * spot_display_type: サーバー側でブロックごとにshort→card交互に設定
 */
export type RpcMixedFeedItem = MergeDeep<
  MixedFeedItemGenerated,
  {
    // 共通フィールド（必ず値が入る）
    item_type: string; // 'map' | 'spot' | 'ad'
    item_id: string;
    created_at: string;
    feed_position: number;
    // スポット表示タイプ（'card' | 'short'）
    // spotの場合のみ有効、map/adの場合はnull
    spot_display_type: string | null;
  }
>;
