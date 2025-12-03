/**
 * 訪問状態をトグルするhook
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  checkMachiVisited,
  toggleVisit,
  getVisitByUserAndMachi,
} from '@/shared/api/supabase/visits';
import { invalidateVisits } from '@/shared/api/query-client';
import type { UUID } from '@/shared/types';

interface ToggleVisitParams {
  userId: UUID;
  machiId: string;
  visitedAt?: string;
}

interface MutationContext {
  previousIsVisited: boolean | undefined;
}

/**
 * 街の訪問状態をチェック
 */
export function useCheckMachiVisited(userId: UUID | null | undefined, machiId: string | null | undefined) {
  return useQuery<boolean, Error>({
    queryKey: ['machi-visit-status', userId, machiId],
    queryFn: () => {
      if (!userId || !machiId) return false;
      return checkMachiVisited(userId, machiId);
    },
    enabled: !!userId && !!machiId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

/**
 * 街の訪問情報を取得
 */
export function useVisitInfo(userId: UUID | null | undefined, machiId: string | null | undefined) {
  return useQuery({
    queryKey: ['machi-visit-info', userId, machiId],
    queryFn: () => {
      if (!userId || !machiId) return null;
      return getVisitByUserAndMachi(userId, machiId);
    },
    enabled: !!userId && !!machiId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 街の訪問状態をトグル（訪問済み↔未訪問）
 */
export function useToggleVisit() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, ToggleVisitParams, MutationContext>({
    mutationFn: async ({ userId, machiId, visitedAt }) => {
      return toggleVisit(userId, machiId, visitedAt);
    },
    onMutate: async ({ userId, machiId }) => {
      // キャンセル
      await queryClient.cancelQueries({ queryKey: ['machi-visit-status', userId, machiId] });

      // 現在の値を保存
      const previousIsVisited = queryClient.getQueryData<boolean>(
        ['machi-visit-status', userId, machiId]
      );

      // 楽観的更新: 訪問状態を反転
      queryClient.setQueryData<boolean>(
        ['machi-visit-status', userId, machiId],
        !previousIsVisited
      );

      return { previousIsVisited };
    },
    onError: (err, { userId, machiId }, context) => {
      console.error('[useToggleVisit] Error:', err);
      Toast.show({
        type: 'error',
        text1: '訪問状態の更新に失敗しました',
        visibilityTime: 3000,
      });
      // エラー時は元に戻す
      if (context?.previousIsVisited !== undefined) {
        queryClient.setQueryData<boolean>(
          ['machi-visit-status', userId, machiId],
          context.previousIsVisited
        );
      }
    },
    onSuccess: (isNowVisited, { userId, machiId }) => {
      // 成功時のトースト
      Toast.show({
        type: 'success',
        text1: isNowVisited ? '訪問済みに追加しました' : '未訪問に変更しました',
        visibilityTime: 2000,
      });

      // 訪問情報キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['machi-visit-info', userId, machiId] });

      // 訪問記録一覧のキャッシュを無効化
      invalidateVisits();
    },
  });
}
