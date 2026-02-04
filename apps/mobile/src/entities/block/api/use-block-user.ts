/**
 * ブロック操作hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { blockUser } from '@/shared/api/supabase/blocks';
import { log } from '@/shared/config/logger';

/**
 * ユーザーをブロックする
 */
export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blockerId,
      blockedId,
    }: {
      blockerId: string;
      blockedId: string;
    }) => blockUser(blockerId, blockedId),
    onMutate: async ({ blockerId, blockedId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.blockStatus(blockerId, blockedId),
      });

      queryClient.setQueryData(QUERY_KEYS.blockStatus(blockerId, blockedId), true);
    },
    onError: (error, { blockerId, blockedId }) => {
      log.error('[Block] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'ブロックに失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(QUERY_KEYS.blockStatus(blockerId, blockedId), false);
    },
    onSuccess: (_, { blockerId, blockedId }) => {
      Toast.show({
        type: 'success',
        text1: 'ブロックしました',
        visibilityTime: 2000,
      });
      // フォロー関連を無効化（トリガーでフォロー解除されるため）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.follows });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followStatus(blockerId, blockedId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followStatus(blockedId, blockerId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followCounts(blockerId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followCounts(blockedId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersStats(blockerId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersStats(blockedId) });
      // フィード・マップ・コメントを無効化（フィルタが変わるため）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mixedFeed() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments });
      // ブロックリストを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blocks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blockedUserIds(blockerId) });
    },
  });
}
