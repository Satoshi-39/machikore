/**
 * スポットいいねをトグルするmutation
 *
 * スポットデータに含まれる is_liked と likes_count を楽観的更新する
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import { toggleSpotLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID, SpotWithDetails } from '@/shared/types';

interface ToggleSpotLikeParams {
  userId: UUID;
  spotId: UUID;
  /** 現在のいいね状態（楽観的更新に使用） */
  isLiked: boolean;
}

interface MutationContext {
  previousIsLiked: boolean;
}

/**
 * InfiniteQueryのページ構造
 */
interface InfiniteData {
  pages: SpotWithDetails[][];
  pageParams: number[];
}

/**
 * MixedFeed用のアイテム型
 */
interface MixedItem {
  type: 'map' | 'spot';
  data: any;
  createdAt: string;
}

/**
 * MixedFeed用のInfiniteQuery構造
 */
interface MixedInfiniteData {
  pages: MixedItem[][];
  pageParams: number[];
}

/**
 * キャッシュ内のスポットの is_liked と likes_count を更新するヘルパー関数
 */
function updateSpotInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  spotId: UUID,
  isLiked: boolean,
  currentUserId: UUID
) {
  const delta = isLiked ? 1 : -1;

  // ['spots', ...] プレフィックスを持つすべてのキャッシュを更新
  // 通常の配列形式（SpotWithDetails[]）
  queryClient.setQueriesData<SpotWithDetails[]>(
    { queryKey: QUERY_KEYS.spots },
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      // InfiniteQueryの場合はpagesプロパティがある
      if ('pages' in oldData) return oldData;
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

  // InfiniteQuery形式（{ pages: SpotWithDetails[][], pageParams: number[] }）
  queryClient.setQueriesData<InfiniteData>(
    { queryKey: QUERY_KEYS.spots },
    (oldData) => {
      if (!oldData || !('pages' in oldData)) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((spot) => {
            if (spot.id === spotId) {
              return {
                ...spot,
                is_liked: isLiked,
                likes_count: Math.max(0, (spot.likes_count || 0) + delta),
              };
            }
            return spot;
          })
        ),
      };
    }
  );

  // 単一スポットキャッシュを更新（spotsDetail）
  queryClient.setQueryData<SpotWithDetails>(
    QUERY_KEYS.spotsDetail(spotId),
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        is_liked: isLiked,
        likes_count: Math.max(0, (oldData.likes_count || 0) + delta),
      };
    }
  );

  // spotsDetailWithUser（ユーザー情報付き詳細）のキャッシュも更新
  queryClient.setQueryData<SpotWithDetails>(
    QUERY_KEYS.spotsDetailWithUser(spotId, currentUserId),
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        is_liked: isLiked,
        likes_count: Math.max(0, (oldData.likes_count || 0) + delta),
      };
    }
  );

  // MixedFeed（混合フィード）のキャッシュも更新
  queryClient.setQueriesData<MixedInfiniteData>(
    { queryKey: QUERY_KEYS.mixedFeed() },
    (oldData) => {
      if (!oldData || !('pages' in oldData)) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((item) => {
            if (item.type === 'spot' && item.data.id === spotId) {
              return {
                ...item,
                data: {
                  ...item.data,
                  is_liked: isLiked,
                  likes_count: Math.max(0, (item.data.likes_count || 0) + delta),
                },
              };
            }
            return item;
          })
        ),
      };
    }
  );
}


/**
 * スポットのいいねをトグル（追加/削除）
 */
export function useToggleSpotLike() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<boolean, Error, ToggleSpotLikeParams, MutationContext>({
    mutationFn: async ({ userId, spotId }) => {
      return toggleSpotLike(userId, spotId);
    },
    onMutate: async ({ userId, spotId, isLiked }) => {
      // 楽観的更新: is_liked を反転、likes_count を更新
      const newIsLiked = !isLiked;
      updateSpotInCache(queryClient, spotId, newIsLiked, userId);

      // spotLikeStatusキャッシュも楽観的更新
      queryClient.setQueryData<boolean>(
        QUERY_KEYS.spotLikeStatus(userId, spotId),
        newIsLiked
      );

      return { previousIsLiked: isLiked };
    },
    onError: (error, { userId, spotId }, context) => {
      log.error('[Like] useToggleSpotLike Error:', error);
      Toast.show({
        type: 'error',
        text1: t('toast.likeFailed'),
        visibilityTime: 3000,
      });
      // エラー時は元に戻す
      if (context) {
        updateSpotInCache(queryClient, spotId, context.previousIsLiked, userId);
        queryClient.setQueryData<boolean>(
          QUERY_KEYS.spotLikeStatus(userId, spotId),
          context.previousIsLiked
        );
      }
    },
    onSuccess: (newLikeStatus, { userId, spotId }) => {
      // スポットのいいね状態キャッシュを更新
      queryClient.setQueryData<boolean>(
        QUERY_KEYS.spotLikeStatus(userId, spotId),
        newLikeStatus
      );
      // いいね一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedSpots(userId) });
    },
  });
}

