/**
 * いいねをトグルするmutation（Supabase版）
 *
 * スポットデータに含まれる is_liked と likes_count を楽観的更新する
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { toggleSpotLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID, SpotWithDetails } from '@/shared/types';

interface ToggleSpotLikeParams {
  userId: UUID;
  spotId: UUID;
}

interface MutationContext {
  previousIsLiked: boolean;
}

/**
 * キャッシュ内のスポットの is_liked と likes_count を更新するヘルパー関数
 */
function updateSpotInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  spotId: UUID,
  isLiked: boolean
) {
  const delta = isLiked ? 1 : -1;

  // ['spots', ...] プレフィックスを持つすべてのキャッシュを更新
  queryClient.setQueriesData<SpotWithDetails[]>(
    { queryKey: QUERY_KEYS.spots },
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      return oldData.map((spot) => {
        if (spot.id === spotId) {
          return {
            ...spot,
            is_liked: isLiked,
            likes_count: Math.max(0, (spot.likes_count || 0) + delta),
          };
        }
        return spot;
      });
    }
  );

  // 単一スポットキャッシュ ['spot', spotId] も更新
  queryClient.setQueryData<SpotWithDetails>(
    ['spot', spotId],
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        is_liked: isLiked,
        likes_count: Math.max(0, (oldData.likes_count || 0) + delta),
      };
    }
  );
}

/**
 * スポットの現在の is_liked 状態を取得
 */
function getSpotIsLiked(
  queryClient: ReturnType<typeof useQueryClient>,
  spotId: UUID
): boolean {
  // ['spots', ...] キャッシュから検索
  const allSpotsQueries = queryClient.getQueriesData<SpotWithDetails[]>({
    queryKey: QUERY_KEYS.spots,
  });

  for (const [, spots] of allSpotsQueries) {
    if (spots && Array.isArray(spots)) {
      const found = spots.find((s) => s.id === spotId);
      if (found) {
        return found.is_liked ?? false;
      }
    }
  }

  // 単一スポットキャッシュからも検索
  const singleSpot = queryClient.getQueryData<SpotWithDetails>(['spot', spotId]);
  if (singleSpot) {
    return singleSpot.is_liked ?? false;
  }

  return false;
}

/**
 * スポットのいいねをトグル（追加/削除）
 */
export function useToggleSpotLike() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, ToggleSpotLikeParams, MutationContext>({
    mutationFn: async ({ userId, spotId }) => {
      return toggleSpotLike(userId, spotId);
    },
    onMutate: async ({ spotId }) => {
      // スポット関連のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.spots });

      // 現在の is_liked 状態を取得
      const previousIsLiked = getSpotIsLiked(queryClient, spotId);

      // 楽観的更新: is_liked を反転、likes_count を更新
      const newIsLiked = !previousIsLiked;
      updateSpotInCache(queryClient, spotId, newIsLiked);

      return { previousIsLiked };
    },
    onError: (error, { spotId }, context) => {
      console.error('[useToggleSpotLike] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'いいねに失敗しました',
        visibilityTime: 3000,
      });
      // エラー時は元に戻す
      if (context) {
        updateSpotInCache(queryClient, spotId, context.previousIsLiked);
      }
    },
  });
}

// 後方互換性のためのエイリアス
export const useToggleLike = useToggleSpotLike;
