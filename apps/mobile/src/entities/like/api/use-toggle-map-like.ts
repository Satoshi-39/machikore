/**
 * マップいいねをトグルするmutation
 *
 * マップデータに含まれる is_liked と likes_count を楽観的更新する
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { log } from '@/shared/config/logger';
import { toggleMapLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID, MapArticleData } from '@/shared/types';

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
  is_liked?: boolean;
}

// InfiniteQueryのページ構造
interface InfiniteData<T> {
  pages: T[][];
  pageParams: number[];
}

/**
 * キャッシュ内のマップのlikes_countとis_likedを更新するヘルパー関数
 */
function updateMapLikesInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  mapId: UUID,
  userId: UUID,
  delta: number,
  newLikeStatus: boolean
) {
  // ['maps', ...] プレフィックスを持つすべてのキャッシュを更新
  // 通常の配列形式
  queryClient.setQueriesData<MapWithLikesCount[]>(
    { queryKey: QUERY_KEYS.maps },
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      // InfiniteQueryの場合はpagesプロパティがある
      if ('pages' in oldData) return oldData;
      return oldData.map((map) => {
        if (map.id === mapId) {
          return {
            ...map,
            likes_count: Math.max(0, (map.likes_count || 0) + delta),
            is_liked: newLikeStatus,
          };
        }
        return map;
      });
    }
  );

  // InfiniteQuery形式
  queryClient.setQueriesData<InfiniteData<MapWithLikesCount>>(
    { queryKey: QUERY_KEYS.maps },
    (oldData) => {
      if (!oldData || !('pages' in oldData)) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((map) => {
            if (map.id === mapId) {
              return {
                ...map,
                likes_count: Math.max(0, (map.likes_count || 0) + delta),
                is_liked: newLikeStatus,
              };
            }
            return map;
          })
        ),
      };
    }
  );

  // 単一マップキャッシュを更新（currentUserIdなし）
  queryClient.setQueryData<MapWithLikesCount>(
    QUERY_KEYS.mapsDetail(mapId),
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        likes_count: Math.max(0, (oldData.likes_count || 0) + delta),
        is_liked: newLikeStatus,
      };
    }
  );

  // 単一マップキャッシュを更新（currentUserIdあり）
  queryClient.setQueryData<MapWithLikesCount>(
    QUERY_KEYS.mapsDetail(mapId, userId),
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        likes_count: Math.max(0, (oldData.likes_count || 0) + delta),
        is_liked: newLikeStatus,
      };
    }
  );

  // 記事ページ用キャッシュを更新
  queryClient.setQueriesData<MapArticleData>(
    { queryKey: QUERY_KEYS.mapsArticle(mapId) },
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        map: {
          ...oldData.map,
          likes_count: Math.max(0, (oldData.map.likes_count || 0) + delta),
          is_liked: newLikeStatus,
        },
      };
    }
  );
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
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.mapLikeStatus(userId, mapId) });

      // 現在の値を保存
      const previousLikeStatus = queryClient.getQueryData<boolean>(
        QUERY_KEYS.mapLikeStatus(userId, mapId)
      );

      // 楽観的更新: いいね状態
      const newLikeStatus = !previousLikeStatus;
      queryClient.setQueryData<boolean>(
        QUERY_KEYS.mapLikeStatus(userId, mapId),
        newLikeStatus
      );

      // 楽観的更新: いいね数とis_liked
      const delta = newLikeStatus ? 1 : -1;
      updateMapLikesInCache(queryClient, mapId, userId, delta, newLikeStatus);

      return { previousLikeStatus };
    },
    onError: (err, { userId, mapId }, context) => {
      log.error('[Like] useToggleMapLike Error:', err);
      Toast.show({
        type: 'error',
        text1: 'いいねに失敗しました',
        visibilityTime: 3000,
      });
      if (context?.previousLikeStatus !== undefined) {
        queryClient.setQueryData<boolean>(
          QUERY_KEYS.mapLikeStatus(userId, mapId),
          context.previousLikeStatus
        );
        // いいね数とis_likedも元に戻す
        const delta = context.previousLikeStatus ? 1 : -1;
        updateMapLikesInCache(queryClient, mapId, userId, delta, context.previousLikeStatus);
      }
    },
    onSuccess: (_, { userId }) => {
      // いいね一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedMaps(userId) });
    },
  });
}
