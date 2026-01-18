/**
 * スポットいいねをトグルするmutation
 *
 * スポットデータに含まれる is_liked と likes_count を楽観的更新する
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { log } from '@/shared/config/logger';
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
  isLiked: boolean
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

  // 単一スポットキャッシュも更新
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
 * キャッシュデータからスポットを全てフラット化して取得
 */
function flattenSpotsFromCache(data: SpotWithDetails[] | InfiniteData | null | undefined): SpotWithDetails[] {
  if (!data) return [];
  if ('pages' in data) return data.pages.flat();
  if (Array.isArray(data)) return data;
  return [];
}

/**
 * MixedFeedキャッシュからスポットを抽出
 */
function extractSpotsFromMixedFeed(data: MixedInfiniteData | null | undefined): SpotWithDetails[] {
  if (!data?.pages) return [];
  return data.pages
    .flat()
    .filter((item): item is MixedItem & { type: 'spot' } => item.type === 'spot')
    .map((item) => item.data as SpotWithDetails);
}

/**
 * スポットの現在の is_liked 状態を取得
 */
function getSpotIsLiked(
  queryClient: ReturnType<typeof useQueryClient>,
  spotId: UUID
): boolean {
  // 単一スポットキャッシュから検索
  const singleSpot = queryClient.getQueryData<SpotWithDetails>(QUERY_KEYS.spotsDetail(spotId));
  if (singleSpot) return singleSpot.is_liked ?? false;

  // spots キャッシュから検索
  const spotsQueries = queryClient.getQueriesData<SpotWithDetails[] | InfiniteData>({
    queryKey: QUERY_KEYS.spots,
  });
  const allSpots = spotsQueries.flatMap(([, data]) => flattenSpotsFromCache(data));
  const foundInSpots = allSpots.find((s) => s.id === spotId);
  if (foundInSpots) return foundInSpots.is_liked ?? false;

  // MixedFeed キャッシュから検索
  const mixedQueries = queryClient.getQueriesData<MixedInfiniteData>({
    queryKey: QUERY_KEYS.mixedFeed(),
  });
  const mixedSpots = mixedQueries.flatMap(([, data]) => extractSpotsFromMixedFeed(data));
  const foundInMixed = mixedSpots.find((s) => s.id === spotId);
  if (foundInMixed) return foundInMixed.is_liked ?? false;

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
    onMutate: async ({ userId, spotId }) => {
      // スポット関連のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.spots });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.spotLikeStatus(userId, spotId) });

      // 現在の is_liked 状態を取得（spotLikeStatusキャッシュを優先）
      const spotLikeStatusCache = queryClient.getQueryData<boolean>(
        QUERY_KEYS.spotLikeStatus(userId, spotId)
      );
      const previousIsLiked = spotLikeStatusCache ?? getSpotIsLiked(queryClient, spotId);

      // 楽観的更新: is_liked を反転、likes_count を更新
      const newIsLiked = !previousIsLiked;
      updateSpotInCache(queryClient, spotId, newIsLiked);

      // spotLikeStatusキャッシュも楽観的更新
      queryClient.setQueryData<boolean>(
        QUERY_KEYS.spotLikeStatus(userId, spotId),
        newIsLiked
      );

      return { previousIsLiked };
    },
    onError: (error, { userId, spotId }, context) => {
      log.error('[Like] useToggleSpotLike Error:', error);
      Toast.show({
        type: 'error',
        text1: 'いいねに失敗しました',
        visibilityTime: 3000,
      });
      // エラー時は元に戻す
      if (context) {
        updateSpotInCache(queryClient, spotId, context.previousIsLiked);
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

