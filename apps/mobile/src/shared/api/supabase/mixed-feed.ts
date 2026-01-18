/**
 * 混合フィード取得API
 *
 * RPC関数を呼び出し、生データを返す
 * 型変換はentities層で行う
 */

import { supabase, handleSupabaseError } from './client';
import { FEED_PAGE_SIZE } from '@/shared/config';
import type { Database } from '@/shared/types';
import type { RpcMixedFeedItem } from '@/shared/types';

// Supabase生成型（全フィールドnullable）
type MixedFeedItemRaw = Database['public']['CompositeTypes']['mixed_feed_item'];

/**
 * RPC結果をRpcMixedFeedItem配列に変換
 * item_type, item_id, created_atが存在するアイテムのみフィルタ（型ガード）
 */
function toMixedFeedItems(data: MixedFeedItemRaw[] | null): RpcMixedFeedItem[] {
  if (!data) return [];
  return data.filter(
    (item): item is RpcMixedFeedItem =>
      item.item_type !== null && item.item_id !== null && item.created_at !== null
  );
}

/**
 * 公開混合フィードを取得（RPC呼び出し、生データを返す）
 *
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 * @param currentUserId 現在のユーザーID（将来的にいいね状態などの取得用）
 * @returns RPC関数の生データ
 */
export async function fetchMixedFeed(
  limit: number = FEED_PAGE_SIZE,
  cursor?: string,
  currentUserId?: string
): Promise<RpcMixedFeedItem[]> {
  const { data, error } = await supabase.rpc('get_mixed_feed', {
    p_limit: limit,
    p_cursor: cursor,
    p_current_user_id: currentUserId,
  });

  if (error) {
    handleSupabaseError('fetchMixedFeed', error);
  }

  return toMixedFeedItems(data);
}

/**
 * フォロー中ユーザーの混合フィードを取得（RPC呼び出し、生データを返す）
 *
 * @param userId 現在のユーザーID（必須）
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 * @returns RPC関数の生データ
 */
export async function fetchFollowingMixedFeed(
  userId: string,
  limit: number = FEED_PAGE_SIZE,
  cursor?: string
): Promise<RpcMixedFeedItem[]> {
  const { data, error } = await supabase.rpc('get_following_mixed_feed', {
    p_user_id: userId,
    p_limit: limit,
    p_cursor: cursor,
  });

  if (error) {
    handleSupabaseError('fetchFollowingMixedFeed', error);
  }

  return toMixedFeedItems(data);
}
