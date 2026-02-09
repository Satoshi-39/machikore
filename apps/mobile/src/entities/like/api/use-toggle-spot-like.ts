/**
 * スポットいいねをトグルするmutation
 *
 * TanStack Query公式の楽観的更新パターンに準拠:
 * - onMutate: cancelQueries + 楽観的更新 + スナップショット
 * - onError: ロールバック
 * - onSettled: invalidateQueriesで整合性を保証
 *
 * @see apps/mobile/docs/OPTIMISTIC_UPDATE_PATTERN.md
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
 * スポットの is_liked と likes_count を更新する純粋関数
 */
function applyLikeUpdate(spot: SpotWithDetails, spotId: UUID, isLiked: boolean): SpotWithDetails {
  if (spot.id !== spotId) return spot;
  const delta = isLiked ? 1 : -1;
  return {
    ...spot,
    is_liked: isLiked,
    likes_count: Math.max(0, (spot.likes_count || 0) + delta),
  };
}

/**
 * キャッシュ内のスポットの is_liked と likes_count を楽観的更新するヘルパー関数
 */
function updateSpotInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  spotId: UUID,
  isLiked: boolean,
  currentUserId: UUID
) {
  // スポットリスト系キャッシュを更新（配列・InfiniteQuery両対応、1回のループで処理）
  queryClient.setQueriesData<SpotWithDetails[] | InfiniteData>(
    { queryKey: QUERY_KEYS.spotsLists() },
    (oldData) => {
      if (!oldData) return oldData;
      if ('pages' in oldData) {
        return {
          ...oldData,
          pages: (oldData as InfiniteData).pages.map((page) =>
            page.map((spot) => applyLikeUpdate(spot, spotId, isLiked))
          ),
        };
      }
      if (Array.isArray(oldData)) {
        return (oldData as SpotWithDetails[]).map((spot) => applyLikeUpdate(spot, spotId, isLiked));
      }
      return oldData;
    }
  );

  // 単一スポットキャッシュを更新
  const updateDetail = (old: SpotWithDetails | undefined) =>
    old ? applyLikeUpdate(old, spotId, isLiked) : old;

  queryClient.setQueryData<SpotWithDetails>(
    QUERY_KEYS.spotsDetail(spotId),
    updateDetail
  );
  queryClient.setQueryData<SpotWithDetails>(
    QUERY_KEYS.spotsDetailWithUser(spotId, currentUserId),
    updateDetail
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
              return { ...item, data: applyLikeUpdate(item.data, spotId, isLiked) };
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
      const newIsLiked = !isLiked;

      // 進行中のリフェッチをキャンセル（楽観的更新を上書きさせない）
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.spotsDetail(spotId) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.spotsDetailWithUser(spotId, userId) });

      // 楽観的更新
      updateSpotInCache(queryClient, spotId, newIsLiked, userId);
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
      // エラー時はロールバック（onSettledのinvalidateQueriesで最終的に整合性を保証）
      if (context) {
        updateSpotInCache(queryClient, spotId, context.previousIsLiked, userId);
        queryClient.setQueryData<boolean>(
          QUERY_KEYS.spotLikeStatus(userId, spotId),
          context.previousIsLiked
        );
      }
    },
    onSettled: (_data, _error, { userId, spotId }) => {
      // 成功・失敗どちらでもリフェッチして整合性を保証
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsDetail(spotId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsDetailWithUser(spotId, userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedSpots(userId) });
    },
  });
}
