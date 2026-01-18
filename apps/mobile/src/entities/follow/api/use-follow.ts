/**
 * フォロー機能用hooks
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  checkIsFollowing,
  checkIsFollowingBatch,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowCounts,
  type FollowRecord,
  type FollowsPage,
} from '@/shared/api/supabase/follows';
import { log } from '@/shared/config/logger';

// ===============================
// 型定義
// ===============================

export type { FollowUser, FollowRecord } from '@/shared/api/supabase/follows';

/** is_following付きのフォローレコード（entity層で構築） */
export interface FollowWithUser extends FollowRecord {
  is_following?: boolean;
}

/** is_following付きのページデータ */
interface FollowsPageWithStatus {
  data: FollowWithUser[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ===============================
// フォロー状態確認
// ===============================

/**
 * フォロー状態を確認
 */
export function useIsFollowing(
  followerId: string | null | undefined,
  followeeId: string | null | undefined
) {
  return useQuery<boolean, Error>({
    queryKey: QUERY_KEYS.followStatus(followerId || '', followeeId || ''),
    queryFn: () => {
      if (!followerId || !followeeId) return false;
      return checkIsFollowing(followerId, followeeId);
    },
    enabled: !!followerId && !!followeeId && followerId !== followeeId,
  });
}

// ===============================
// フォロー操作
// ===============================

/**
 * フォローする
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followerId,
      followeeId,
    }: {
      followerId: string;
      followeeId: string;
    }) => followUser(followerId, followeeId),
    onMutate: async ({ followerId, followeeId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.followStatus(followerId, followeeId),
      });

      queryClient.setQueryData(QUERY_KEYS.followStatus(followerId, followeeId), true);

      // フォロー数も楽観的に更新
      const previousCounts = queryClient.getQueryData<{
        followers: number;
        following: number;
      }>(QUERY_KEYS.followCounts(followeeId));

      if (previousCounts) {
        queryClient.setQueryData(QUERY_KEYS.followCounts(followeeId), {
          ...previousCounts,
          followers: previousCounts.followers + 1,
        });
      }

      return { previousCounts };
    },
    onError: (error, { followerId, followeeId }, context) => {
      log.error('[Follow] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'フォローに失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(QUERY_KEYS.followStatus(followerId, followeeId), false);
      if (context?.previousCounts) {
        queryClient.setQueryData(QUERY_KEYS.followCounts(followeeId), context.previousCounts);
      }
    },
    onSuccess: (_, { followerId, followeeId }) => {
      Toast.show({
        type: 'success',
        text1: 'フォローしました',
        visibilityTime: 2000,
      });
      // 関連クエリを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followers(followeeId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.following(followerId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.follows });
      // userStatsも無効化（プロフィール画面のフォロー数表示用）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersStats(followeeId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersStats(followerId) });
    },
  });
}

/**
 * フォロー解除する
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followerId,
      followeeId,
    }: {
      followerId: string;
      followeeId: string;
    }) => unfollowUser(followerId, followeeId),
    onMutate: async ({ followerId, followeeId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.followStatus(followerId, followeeId),
      });

      queryClient.setQueryData(QUERY_KEYS.followStatus(followerId, followeeId), false);

      // フォロー数も楽観的に更新
      const previousCounts = queryClient.getQueryData<{
        followers: number;
        following: number;
      }>(QUERY_KEYS.followCounts(followeeId));

      if (previousCounts) {
        queryClient.setQueryData(QUERY_KEYS.followCounts(followeeId), {
          ...previousCounts,
          followers: Math.max(0, previousCounts.followers - 1),
        });
      }

      return { previousCounts };
    },
    onError: (error, { followerId, followeeId }, context) => {
      log.error('[Follow] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'フォロー解除に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(QUERY_KEYS.followStatus(followerId, followeeId), true);
      if (context?.previousCounts) {
        queryClient.setQueryData(QUERY_KEYS.followCounts(followeeId), context.previousCounts);
      }
    },
    onSuccess: (_, { followerId, followeeId }) => {
      Toast.show({
        type: 'success',
        text1: 'フォローを解除しました',
        visibilityTime: 2000,
      });
      // フォロー数のみ即座に更新（リストは次回表示時に更新）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.follows });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersStats(followeeId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersStats(followerId) });
    },
  });
}

// ===============================
// フォロワー/フォロー中一覧（無限スクロール対応）
// ===============================

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

// ===============================
// フォロー数
// ===============================

/**
 * フォロワー数とフォロー中数を取得
 */
export function useFollowCounts(userId: string | null | undefined) {
  return useQuery<{ followers: number; following: number }, Error>({
    queryKey: QUERY_KEYS.followCounts(userId || ''),
    queryFn: () => {
      if (!userId) return { followers: 0, following: 0 };
      return getFollowCounts(userId);
    },
    enabled: !!userId,
  });
}
