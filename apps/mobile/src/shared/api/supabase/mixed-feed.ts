/**
 * 混合フィード取得API
 *
 * RPC関数を呼び出し、生データを返す
 * 型変換はentities層で行う
 */

import { supabase, handleSupabaseError } from './client';
import type { Database } from '@/shared/types';
import type { RpcMixedFeedItem } from '@/shared/types';

// Supabase生成型（全フィールドnullable）
type MixedFeedItemRaw = Database['public']['CompositeTypes']['mixed_feed_item'];

/** 混合フィードのデフォルト取得件数 */
const DEFAULT_MAP_LIMIT = 8;
const DEFAULT_SPOT_LIMIT = 8;

/** 混合フィード取得オプション */
export interface FetchMixedFeedOptions {
  /** マップの取得件数 */
  mapLimit?: number;
  /** スポットの取得件数 */
  spotLimit?: number;
  /** マップのページネーションカーソル（created_at） */
  mapCursor?: string;
  /** スポットのページネーションカーソル（created_at） */
  spotCursor?: string;
  /** 現在のユーザーID（いいね状態などの取得用） */
  currentUserId?: string;
  /** 広告を表示するか（サブスクユーザーはfalse） */
  showAds?: boolean;
  /** 開始位置（無限スクロール用） */
  startPosition?: number;
}

/**
 * RPC結果をRpcMixedFeedItem配列に変換
 * item_typeが存在するアイテムのみフィルタ
 */
function toMixedFeedItems(data: MixedFeedItemRaw[] | null): RpcMixedFeedItem[] {
  if (!data) return [];
  return data.filter(
    (item): item is RpcMixedFeedItem => item.item_type !== null
  );
}

/**
 * 公開混合フィードを取得（RPC呼び出し、生データを返す）
 * spot_display_typeはサーバー側でブロックごとにshort→card交互に設定される
 *
 * @param options 取得オプション
 * @returns RPC関数の生データ
 */
export async function fetchMixedFeed(
  options: FetchMixedFeedOptions = {}
): Promise<RpcMixedFeedItem[]> {
  const {
    mapLimit = DEFAULT_MAP_LIMIT,
    spotLimit = DEFAULT_SPOT_LIMIT,
    mapCursor,
    spotCursor,
    currentUserId,
    showAds = true,
    startPosition = 0,
  } = options;

  const { data, error } = await supabase.rpc('get_mixed_feed', {
    p_map_limit: mapLimit,
    p_spot_limit: spotLimit,
    p_map_cursor: mapCursor,
    p_spot_cursor: spotCursor,
    p_current_user_id: currentUserId,
    p_show_ads: showAds,
    p_start_position: startPosition,
  });

  if (error) {
    handleSupabaseError('fetchMixedFeed', error);
  }

  return toMixedFeedItems(data);
}

/** フォロー中混合フィード取得オプション */
export interface FetchFollowingMixedFeedOptions {
  /** ユーザーID（必須） */
  userId: string;
  /** マップの取得件数 */
  mapLimit?: number;
  /** スポットの取得件数 */
  spotLimit?: number;
  /** マップのページネーションカーソル（created_at） */
  mapCursor?: string;
  /** スポットのページネーションカーソル（created_at） */
  spotCursor?: string;
  /** 広告を表示するか（サブスクユーザーはfalse） */
  showAds?: boolean;
  /** 開始位置（無限スクロール用） */
  startPosition?: number;
}

/**
 * フォロー中ユーザーの混合フィードを取得（RPC呼び出し、生データを返す）
 * spot_display_typeはサーバー側でブロックごとにshort→card交互に設定される
 *
 * @param options 取得オプション
 * @returns RPC関数の生データ
 */
export async function fetchFollowingMixedFeed(
  options: FetchFollowingMixedFeedOptions
): Promise<RpcMixedFeedItem[]> {
  const {
    userId,
    mapLimit = DEFAULT_MAP_LIMIT,
    spotLimit = DEFAULT_SPOT_LIMIT,
    mapCursor,
    spotCursor,
    showAds = true,
    startPosition = 0,
  } = options;

  const { data, error } = await supabase.rpc('get_following_mixed_feed', {
    p_user_id: userId,
    p_map_limit: mapLimit,
    p_spot_limit: spotLimit,
    p_map_cursor: mapCursor,
    p_spot_cursor: spotCursor,
    p_show_ads: showAds,
    p_start_position: startPosition,
  });

  if (error) {
    handleSupabaseError('fetchFollowingMixedFeed', error);
  }

  return toMixedFeedItems(data);
}
