/**
 * フォロー機能用hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  checkIsFollowing,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowCounts,
  type FollowWithUser,
} from '@/shared/api/supabase/follows';

// 型を再エクスポート
export type { FollowWithUser, FollowUser } from '@/shared/api/supabase/follows';

/**
 * フォロー状態を確認
 */
export function useIsFollowing(
  followerId: string | null | undefined,
  followeeId: string | null | undefined
) {
  return useQuery<boolean, Error>({
    queryKey: ['follow-status', followerId, followeeId],
    queryFn: () => {
      if (!followerId || !followeeId) return false;
      return checkIsFollowing(followerId, followeeId);
    },
    enabled: !!followerId && !!followeeId && followerId !== followeeId,
  });
}

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
        queryKey: ['follow-status', followerId, followeeId],
      });

      queryClient.setQueryData(['follow-status', followerId, followeeId], true);

      // フォロー数も楽観的に更新
      const previousCounts = queryClient.getQueryData<{
        followers: number;
        following: number;
      }>(['follow-counts', followeeId]);

      if (previousCounts) {
        queryClient.setQueryData(['follow-counts', followeeId], {
          ...previousCounts,
          followers: previousCounts.followers + 1,
        });
      }

      return { previousCounts };
    },
    onError: (error, { followerId, followeeId }, context) => {
      console.error('[useFollowUser] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'フォローに失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(['follow-status', followerId, followeeId], false);
      if (context?.previousCounts) {
        queryClient.setQueryData(['follow-counts', followeeId], context.previousCounts);
      }
    },
    onSuccess: (_, { followerId, followeeId }) => {
      Toast.show({
        type: 'success',
        text1: 'フォローしました',
        visibilityTime: 2000,
      });
      // 関連クエリを無効化
      queryClient.invalidateQueries({ queryKey: ['followers', followeeId] });
      queryClient.invalidateQueries({ queryKey: ['following', followerId] });
      queryClient.invalidateQueries({ queryKey: ['follow-counts'] });
      // userStatsも無効化（プロフィール画面のフォロー数表示用）
      queryClient.invalidateQueries({ queryKey: ['userStats', followeeId] });
      queryClient.invalidateQueries({ queryKey: ['userStats', followerId] });
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
        queryKey: ['follow-status', followerId, followeeId],
      });

      queryClient.setQueryData(['follow-status', followerId, followeeId], false);

      // フォロー数も楽観的に更新
      const previousCounts = queryClient.getQueryData<{
        followers: number;
        following: number;
      }>(['follow-counts', followeeId]);

      if (previousCounts) {
        queryClient.setQueryData(['follow-counts', followeeId], {
          ...previousCounts,
          followers: Math.max(0, previousCounts.followers - 1),
        });
      }

      return { previousCounts };
    },
    onError: (error, { followerId, followeeId }, context) => {
      console.error('[useUnfollowUser] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'フォロー解除に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(['follow-status', followerId, followeeId], true);
      if (context?.previousCounts) {
        queryClient.setQueryData(['follow-counts', followeeId], context.previousCounts);
      }
    },
    onSuccess: (_, { followerId, followeeId }) => {
      Toast.show({
        type: 'success',
        text1: 'フォローを解除しました',
        visibilityTime: 2000,
      });
      // フォロー数のみ即座に更新（リストは次回表示時に更新）
      queryClient.invalidateQueries({ queryKey: ['follow-counts'] });
      queryClient.invalidateQueries({ queryKey: ['userStats', followeeId] });
      queryClient.invalidateQueries({ queryKey: ['userStats', followerId] });
    },
  });
}

/**
 * フォロワー一覧を取得
 */
export function useFollowers(userId: string | null | undefined) {
  return useQuery<FollowWithUser[], Error>({
    queryKey: ['followers', userId],
    queryFn: () => {
      if (!userId) return [];
      return getFollowers(userId);
    },
    enabled: !!userId,
    staleTime: 0, // 常に再取得（フォロー解除後の再表示で最新データを取得）
  });
}

/**
 * フォロー中一覧を取得
 */
export function useFollowing(userId: string | null | undefined) {
  return useQuery<FollowWithUser[], Error>({
    queryKey: ['following', userId],
    queryFn: () => {
      if (!userId) return [];
      return getFollowing(userId);
    },
    enabled: !!userId,
    staleTime: 0, // 常に再取得（フォロー解除後の再表示で最新データを取得）
  });
}

/**
 * フォロワー数とフォロー中数を取得
 */
export function useFollowCounts(userId: string | null | undefined) {
  return useQuery<{ followers: number; following: number }, Error>({
    queryKey: ['follow-counts', userId],
    queryFn: () => {
      if (!userId) return { followers: 0, following: 0 };
      return getFollowCounts(userId);
    },
    enabled: !!userId,
  });
}
