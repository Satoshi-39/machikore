/**
 * マップいいねをトグルするmutation
 *
 * マップデータに含まれる is_liked と likes_count を楽観的更新する
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { checkMapLiked, toggleMapLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID } from '@/shared/types';

interface ToggleMapLikeParams {
  userId: UUID;
  mapId: UUID;
}

interface MutationContext {
  previousLikeStatus: boolean | undefined;
}

// キャッシュ更新用の最小限のマップ型
interface MapWithLikesCount {
  id: string;
  likes_count?: number | null;
}

/**
 * キャッシュ内のマップのlikes_countを更新するヘルパー関数
 */
function updateMapLikesCountInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  mapId: UUID,
  delta: number
) {
  // ['maps', ...] プレフィックスを持つすべてのキャッシュを更新
  queryClient.setQueriesData<MapWithLikesCount[]>(
    { queryKey: QUERY_KEYS.maps },
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      return oldData.map((map) => {
        if (map.id === mapId) {
          return {
            ...map,
            likes_count: Math.max(0, (map.likes_count || 0) + delta),
          };
        }
        return map;
      });
    }
  );

  // 単一マップキャッシュ ['map', mapId] を更新
  queryClient.setQueryData<MapWithLikesCount>(
    ['map', mapId],
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        likes_count: Math.max(0, (oldData.likes_count || 0) + delta),
      };
    }
  );
}

/**
 * マップのいいね状態をチェック
 */
export function useCheckMapLiked(userId: UUID | null | undefined, mapId: UUID | null | undefined) {
  return useQuery<boolean, Error>({
    queryKey: ['map-like-status', userId, mapId],
    queryFn: () => {
      if (!userId || !mapId) return false;
      return checkMapLiked(userId, mapId);
    },
    enabled: !!userId && !!mapId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ（楽観的更新が優先される）
  });
}

/**
 * マップのいいねをトグル（追加/削除）
 */
export function useToggleMapLike() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, ToggleMapLikeParams, MutationContext>({
    mutationFn: async ({ userId, mapId }) => {
      return toggleMapLike(userId, mapId);
    },
    onMutate: async ({ userId, mapId }) => {
      // キャンセル
      await queryClient.cancelQueries({ queryKey: ['map-like-status', userId, mapId] });

      // 現在の値を保存
      const previousLikeStatus = queryClient.getQueryData<boolean>(
        ['map-like-status', userId, mapId]
      );

      // 楽観的更新: いいね状態
      const newLikeStatus = !previousLikeStatus;
      queryClient.setQueryData<boolean>(
        ['map-like-status', userId, mapId],
        newLikeStatus
      );

      // 楽観的更新: いいね数
      const delta = newLikeStatus ? 1 : -1;
      updateMapLikesCountInCache(queryClient, mapId, delta);

      return { previousLikeStatus };
    },
    onError: (err, { userId, mapId }, context) => {
      console.error('[useToggleMapLike] Error:', err);
      Toast.show({
        type: 'error',
        text1: 'いいねに失敗しました',
        visibilityTime: 3000,
      });
      if (context?.previousLikeStatus !== undefined) {
        queryClient.setQueryData<boolean>(
          ['map-like-status', userId, mapId],
          context.previousLikeStatus
        );
        // いいね数も元に戻す
        const delta = context.previousLikeStatus ? 1 : -1;
        updateMapLikesCountInCache(queryClient, mapId, delta);
      }
    },
  });
}
