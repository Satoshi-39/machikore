/**
 * ブロック解除hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { unblockUser } from '@/shared/api/supabase/blocks';
import { log } from '@/shared/config/logger';

/**
 * ユーザーのブロックを解除する
 */
export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blockerId,
      blockedId,
    }: {
      blockerId: string;
      blockedId: string;
    }) => unblockUser(blockerId, blockedId),
    onMutate: async ({ blockerId, blockedId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.blockStatus(blockerId, blockedId),
      });

      queryClient.setQueryData(QUERY_KEYS.blockStatus(blockerId, blockedId), false);
    },
    onError: (error, { blockerId, blockedId }) => {
      log.error('[Block] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'ブロック解除に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(QUERY_KEYS.blockStatus(blockerId, blockedId), true);
    },
    onSuccess: (_, { blockerId }) => {
      Toast.show({
        type: 'success',
        text1: 'ブロックを解除しました',
        visibilityTime: 2000,
      });
      // フィード再取得（ブロック解除でコンテンツが再表示されるため）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mixedFeed() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments });
      // ブロックリストを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blocks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blockedUserIds(blockerId) });
    },
  });
}
