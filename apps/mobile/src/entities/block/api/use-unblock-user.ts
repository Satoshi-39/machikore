/**
 * ブロック解除hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { unblockUser } from '@/shared/api/supabase/blocks';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

/**
 * ユーザーのブロックを解除する
 */
export function useUnblockUser() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({
      blockerId,
      blockedId,
    }: {
      blockerId: string;
      blockedId: string;
    }) => unblockUser(blockerId, blockedId),
    onMutate: async ({ blockerId, blockedId }) => {
      // 楽観的更新: blockStatus
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.blockStatus(blockerId, blockedId),
      });
      queryClient.setQueryData(QUERY_KEYS.blockStatus(blockerId, blockedId), false);

      // 楽観的更新: ブロックリストから即座に除外
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.blockedUsers(blockerId),
      });
      const previousBlockedUsers = queryClient.getQueryData(
        QUERY_KEYS.blockedUsers(blockerId)
      );
      queryClient.setQueryData<{ pages: any[]; pageParams: any[] }>(
        QUERY_KEYS.blockedUsers(blockerId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((user: any) => user.id !== blockedId),
            })),
          };
        }
      );

      return { previousBlockedUsers };
    },
    onError: (error, { blockerId, blockedId }, context) => {
      log.error('[Block] Error:', error);
      Toast.show({
        type: 'error',
        text1: t('block.unblockFailed'),
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(QUERY_KEYS.blockStatus(blockerId, blockedId), true);
      if (context?.previousBlockedUsers) {
        queryClient.setQueryData(
          QUERY_KEYS.blockedUsers(blockerId),
          context.previousBlockedUsers
        );
      }
    },
    onSuccess: (_, { blockerId }) => {
      Toast.show({
        type: 'success',
        text1: t('block.unblocked'),
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
