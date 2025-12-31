/**
 * マスタースポットのお気に入り関連hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  checkMasterSpotFavorited,
  addMasterSpotFavorite,
  removeMasterSpotFavorite,
  toggleMasterSpotFavorite,
  getUserFavoriteMasterSpotIds,
} from '@/shared/api/supabase/master-spot-favorites';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';

/**
 * マスタースポットがお気に入りか確認
 */
export function useCheckMasterSpotFavorited(
  userId: string | null | undefined,
  masterSpotId: string | null | undefined
) {
  return useQuery<boolean, Error>({
    queryKey: QUERY_KEYS.masterSpotFavorite(userId || '', masterSpotId || ''),
    queryFn: () => {
      if (!userId || !masterSpotId) return false;
      return checkMasterSpotFavorited(userId, masterSpotId);
    },
    enabled: !!userId && !!masterSpotId,
  });
}

/**
 * ユーザーのお気に入りマスタースポットIDリストを取得
 */
export function useUserFavoriteMasterSpotIds(
  userId: string | null | undefined
) {
  return useQuery<string[], Error>({
    queryKey: QUERY_KEYS.masterSpotFavoriteIds(userId || ''),
    queryFn: () => {
      if (!userId) return [];
      return getUserFavoriteMasterSpotIds(userId);
    },
    enabled: !!userId,
  });
}

/**
 * マスタースポットのお気に入りをトグル
 */
export function useToggleMasterSpotFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      masterSpotId,
    }: {
      userId: string;
      masterSpotId: string;
    }) => toggleMasterSpotFavorite(userId, masterSpotId),
    onMutate: async ({ userId, masterSpotId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
      });

      const previousStatus = queryClient.getQueryData<boolean>(
        QUERY_KEYS.masterSpotFavorite(userId, masterSpotId)
      );

      queryClient.setQueryData(
        QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
        !previousStatus
      );

      return { previousStatus };
    },
    onError: (error, { userId, masterSpotId }, context) => {
      log.error('[MasterSpotFavorite] useToggleMasterSpotFavorite Error:', error);
      Toast.show({
        type: 'error',
        text1: 'お気に入り登録に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
          context.previousStatus
        );
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.masterSpotFavoriteIds(userId) });
    },
  });
}

/**
 * マスタースポットをお気に入りに追加
 */
export function useAddMasterSpotFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      masterSpotId,
    }: {
      userId: string;
      masterSpotId: string;
    }) => addMasterSpotFavorite(userId, masterSpotId),
    onMutate: async ({ userId, masterSpotId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
      });

      queryClient.setQueryData(
        QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
        true
      );
    },
    onError: (error, { userId, masterSpotId }) => {
      log.error('[MasterSpotFavorite] useAddMasterSpotFavorite Error:', error);
      Toast.show({
        type: 'error',
        text1: 'お気に入り登録に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(
        QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
        false
      );
    },
    onSuccess: (_, { userId, masterSpotId }) => {
      Toast.show({
        type: 'success',
        text1: 'お気に入りに追加しました',
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.masterSpotFavorite(userId, masterSpotId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.masterSpotFavoriteIds(userId) });
    },
  });
}

/**
 * マスタースポットのお気に入りを解除
 */
export function useRemoveMasterSpotFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      masterSpotId,
    }: {
      userId: string;
      masterSpotId: string;
    }) => removeMasterSpotFavorite(userId, masterSpotId),
    onMutate: async ({ userId, masterSpotId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
      });

      queryClient.setQueryData(
        QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
        false
      );
    },
    onError: (error, { userId, masterSpotId }) => {
      log.error('[MasterSpotFavorite] useRemoveMasterSpotFavorite Error:', error);
      Toast.show({
        type: 'error',
        text1: 'お気に入り解除に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(
        QUERY_KEYS.masterSpotFavorite(userId, masterSpotId),
        true
      );
    },
    onSuccess: (_, { userId, masterSpotId }) => {
      Toast.show({
        type: 'success',
        text1: 'お気に入りを解除しました',
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.masterSpotFavorite(userId, masterSpotId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.masterSpotFavoriteIds(userId) });
    },
  });
}
