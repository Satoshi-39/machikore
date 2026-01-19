/**
 * フォロワー/フォロー中一覧hooks（無限スクロール対応）
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  checkIsFollowingBatch,
  getFollowers,
  getFollowing,
  type FollowsPage,
} from '@/shared/api/supabase/follows';
import type { FollowsPageWithStatus } from './types';

/**
 * フォロー状態をマージするヘルパー関数
 */
async function mergeFollowingStatus(
  page: FollowsPage,
  currentUserId: string | null | undefined
): Promise<FollowsPageWithStatus> {
  if (!currentUserId || page.data.length === 0) {
    return {
      ...page,
      data: page.data.map((item) => ({ ...item, is_following: undefined })),
    };
  }

  const userIds = page.data.map((item) => item.user.id);
  const followingSet = await checkIsFollowingBatch(currentUserId, userIds);

  return {
    ...page,
    data: page.data.map((item) => ({
      ...item,
      is_following: followingSet.has(item.user.id),
    })),
  };
}

/**
 * フォロワー一覧を取得（無限スクロール対応）
 */
export function useFollowers(
  userId: string | null | undefined,
  currentUserId?: string | null
) {
  return useInfiniteQuery<FollowsPageWithStatus, Error>({
    queryKey: QUERY_KEYS.followers(userId || '', currentUserId),
    queryFn: async ({ pageParam }) => {
      if (!userId) {
        return { data: [], nextCursor: null, hasMore: false };
      }
      const page = await getFollowers(userId, pageParam as string | undefined);
      return mergeFollowingStatus(page, currentUserId);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
    staleTime: 0,
  });
}

/**
 * フォロー中一覧を取得（無限スクロール対応）
 */
export function useFollowing(
  userId: string | null | undefined,
  currentUserId?: string | null
) {
  return useInfiniteQuery<FollowsPageWithStatus, Error>({
    queryKey: QUERY_KEYS.following(userId || '', currentUserId),
    queryFn: async ({ pageParam }) => {
      if (!userId) {
        return { data: [], nextCursor: null, hasMore: false };
      }
      const page = await getFollowing(userId, pageParam as string | undefined);
      return mergeFollowingStatus(page, currentUserId);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
    staleTime: 0,
  });
}
