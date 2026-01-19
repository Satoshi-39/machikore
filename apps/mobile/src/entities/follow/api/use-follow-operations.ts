/**
 * フォロー操作hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { followUser, unfollowUser } from '@/shared/api/supabase/follows';
import { log } from '@/shared/config/logger';

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
