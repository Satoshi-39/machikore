/**
 * 混合フィード取得 Hook
 *
 * RPC関数を呼び出し、型変換を行って返す
 * cursor方式の無限スクロール対応
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMixedFeed, fetchFollowingMixedFeed } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { FEED_PAGE_SIZE } from '@/shared/config';
import { transformMixedFeedItems, type MixedFeedItem } from '../model';

interface UseMixedFeedOptions {
  /** 現在のユーザーID（いいね状態などの取得用） */
  currentUserId?: string | null;
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
  const { currentUserId, enabled = true } = options;

  return useInfiniteQuery<MixedFeedItem[], Error>({
    queryKey: [...QUERY_KEYS.mixedFeed(), 'recommend'],
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | undefined;
      const rawItems = await fetchMixedFeed(FEED_PAGE_SIZE, cursor, currentUserId ?? undefined);
      return transformMixedFeedItems(rawItems);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 取得した件数がFEED_PAGE_SIZE未満なら次のページはない
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      // 最後のアイテムのcreated_atをcursorとして返す
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.createdAt;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    enabled,
  });
}

interface UseFollowingMixedFeedOptions {
  /** 現在のユーザーID（必須） */
  userId: string | undefined;
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
  const { userId, enabled = true } = options;

  return useInfiniteQuery<MixedFeedItem[], Error>({
    queryKey: [...QUERY_KEYS.mixedFeed(), 'following', userId],
    queryFn: async ({ pageParam }) => {
      if (!userId) return [];
      const cursor = pageParam as string | undefined;
      const rawItems = await fetchFollowingMixedFeed(userId, FEED_PAGE_SIZE, cursor);
      return transformMixedFeedItems(rawItems);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 取得した件数がFEED_PAGE_SIZE未満なら次のページはない
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      // 最後のアイテムのcreated_atをcursorとして返す
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.createdAt;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    enabled: enabled && !!userId, // enabledかつログイン時のみ有効
  });
}
