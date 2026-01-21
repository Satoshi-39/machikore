/**
 * 混合フィード取得 Hook
 *
 * RPC関数を呼び出し、型変換を行って返す
 * feed_position方式の無限スクロール対応
 * 配置: map×4 → feed_native → spot×4(carousel_video含む) → 繰り返し
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchMixedFeed,
  fetchFollowingMixedFeed,
} from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { MIXED_FEED } from '@/shared/config';
import { transformMixedFeedItems, type MixedFeedItem } from '../model';

/** ページネーション用のパラメータ */
interface PageParam {
  mapCursor?: string;
  spotCursor?: string;
  startPosition: number;
}

interface UseMixedFeedOptions {
  /** 現在のユーザーID（いいね状態などの取得用） */
  currentUserId?: string | null;
  /** 広告を表示するか（サブスクユーザーはfalse） */
  showAds?: boolean;
  /** クエリを有効にするか（デフォルト: true） */
  enabled?: boolean;
}

/**
 * 公開混合フィード取得Hook（おすすめタブ用）
 *
 * @param options オプション
 * @returns 無限スクロール対応のクエリ結果
 */
export function useMixedFeed(options: UseMixedFeedOptions = {}) {
  const { currentUserId, showAds = true, enabled = true } = options;

  return useInfiniteQuery<MixedFeedItem[], Error>({
    queryKey: [...QUERY_KEYS.mixedFeed(), 'recommend', showAds],
    queryFn: async ({ pageParam }) => {
      const { mapCursor, spotCursor, startPosition } = pageParam as PageParam;

      const rawItems = await fetchMixedFeed({
        mapLimit: MIXED_FEED.MAP_LIMIT,
        spotLimit: MIXED_FEED.SPOT_LIMIT,
        mapCursor,
        spotCursor,
        currentUserId: currentUserId ?? undefined,
        showAds,
        startPosition,
      });

      return transformMixedFeedItems(rawItems);
    },
    initialPageParam: { startPosition: 0 } as PageParam,
    getNextPageParam: (lastPage, allPages) => {
      // マップとスポットの最後のcreated_atを取得
      const maps = lastPage.filter((item) => item.type === 'map');
      const spots = lastPage.filter((item) => item.type === 'spot');

      // マップもスポットも取得できなくなったら終了
      if (maps.length === 0 && spots.length === 0) {
        return undefined;
      }

      // 次のページのcursorを計算
      const lastMap = maps[maps.length - 1];
      const lastSpot = spots[spots.length - 1];

      // 次のstartPositionを計算
      const totalItems = allPages.flatMap((page) => page).length;
      const itemsPerBlock = showAds
        ? MIXED_FEED.ITEMS_PER_BLOCK_WITH_ADS
        : MIXED_FEED.ITEMS_PER_BLOCK_WITHOUT_ADS;
      const nextStartPosition = Math.floor(totalItems / itemsPerBlock) * itemsPerBlock;

      return {
        mapCursor: lastMap?.createdAt,
        spotCursor: lastSpot?.createdAt,
        startPosition: nextStartPosition,
      } as PageParam;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    enabled,
  });
}

interface UseFollowingMixedFeedOptions {
  /** 現在のユーザーID（必須） */
  userId: string | undefined;
  /** 広告を表示するか（サブスクユーザーはfalse） */
  showAds?: boolean;
  /** クエリを有効にするか（デフォルト: true、userIdがない場合は自動でfalse） */
  enabled?: boolean;
}

/**
 * フォロー中ユーザーの混合フィード取得Hook（フォロー中タブ用）
 *
 * @param options オプション
 * @returns 無限スクロール対応のクエリ結果
 */
export function useFollowingMixedFeed(options: UseFollowingMixedFeedOptions) {
  const { userId, showAds = true, enabled = true } = options;

  return useInfiniteQuery<MixedFeedItem[], Error>({
    queryKey: [...QUERY_KEYS.mixedFeed(), 'following', userId, showAds],
    queryFn: async ({ pageParam }) => {
      if (!userId) return [];

      const { mapCursor, spotCursor, startPosition } = pageParam as PageParam;

      const rawItems = await fetchFollowingMixedFeed({
        userId,
        mapLimit: MIXED_FEED.MAP_LIMIT,
        spotLimit: MIXED_FEED.SPOT_LIMIT,
        mapCursor,
        spotCursor,
        showAds,
        startPosition,
      });

      return transformMixedFeedItems(rawItems);
    },
    initialPageParam: { startPosition: 0 } as PageParam,
    getNextPageParam: (lastPage, allPages) => {
      const maps = lastPage.filter((item) => item.type === 'map');
      const spots = lastPage.filter((item) => item.type === 'spot');

      if (maps.length === 0 && spots.length === 0) {
        return undefined;
      }

      const lastMap = maps[maps.length - 1];
      const lastSpot = spots[spots.length - 1];

      const totalItems = allPages.flatMap((page) => page).length;
      const itemsPerBlock = showAds
        ? MIXED_FEED.ITEMS_PER_BLOCK_WITH_ADS
        : MIXED_FEED.ITEMS_PER_BLOCK_WITHOUT_ADS;
      const nextStartPosition = Math.floor(totalItems / itemsPerBlock) * itemsPerBlock;

      return {
        mapCursor: lastMap?.createdAt,
        spotCursor: lastSpot?.createdAt,
        startPosition: nextStartPosition,
      } as PageParam;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    enabled: enabled && !!userId,
  });
}
