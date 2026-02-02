/**
 * マップいいねをトグルするmutation
 *
 * マップデータに含まれる is_liked と likes_count を楽観的更新する
 * - 楽観的更新: 現在マウントされている全キャッシュを即座に更新（APIリクエストなし）
 * - invalidateQueries: いいね一覧など別のデータ構造のみ
 */

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { log } from '@/shared/config/logger';
import { toggleMapLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID, MapArticleData } from '@/shared/types';

interface ToggleMapLikeParams {
  userId: UUID;
  mapId: UUID;
  /** 現在のいいね状態（楽観的更新に使用） */
  isLiked: boolean;
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

// MixedFeedItem型（循環参照を避けるためローカル定義）
interface MixedFeedItem {
  type: 'map' | 'spot' | 'ad';
  data?: MapWithLikesCount;
}

/**
 * マップのlikes_countとis_likedを更新するユーティリティ
 */
function updateMapLikes(map: MapWithLikesCount, mapId: string, delta: number, newLikeStatus: boolean): MapWithLikesCount {
  if (map.id !== mapId) return map;
  return {
    ...map,
    likes_count: Math.max(0, (map.likes_count || 0) + delta),
    is_liked: newLikeStatus,
  };
}

/**
 * キャッシュ内のマップのlikes_countとis_likedを更新するヘルパー関数
 * TkDodo推奨の階層構造キーを使用
 */
function updateMapLikesInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  mapId: UUID,
  userId: UUID,
  delta: number,
  newLikeStatus: boolean
) {
  // マップリスト系キャッシュを一括更新（['maps', 'list', *] にマッチ）
  // user, feed, search, popular, today, category-popular, category-latest, featured-category など全て
  queryClient.setQueriesData<MapWithLikesCount[] | InfiniteData<MapWithLikesCount[]>>(
    { queryKey: QUERY_KEYS.mapsLists() },
    (oldData) => {
      if (!oldData) return oldData;
      // InfiniteData形式（pages配列を持つ）の場合
      if ('pages' in oldData) {
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((map) => updateMapLikes(map, mapId, delta, newLikeStatus))
          ),
        };
      }
      // 通常の配列形式
      if (Array.isArray(oldData)) {
        return oldData.map((map) => updateMapLikes(map, mapId, delta, newLikeStatus));
      }
      return oldData;
    }
  );

  // マップ詳細系キャッシュを一括更新（['maps', 'detail', *] にマッチ）
  // detail, article, labels など全て
  queryClient.setQueriesData<MapWithLikesCount | MapArticleData>(
    { queryKey: QUERY_KEYS.mapsDetails() },
    (oldData) => {
      if (!oldData) return oldData;
      // MapArticleData形式（map プロパティを持つ）の場合
      if ('map' in oldData && oldData.map) {
        if (oldData.map.id !== mapId) return oldData;
        return {
          ...oldData,
          map: {
            ...oldData.map,
            likes_count: Math.max(0, (oldData.map.likes_count || 0) + delta),
            is_liked: newLikeStatus,
          },
        };
      }
      // 通常のマップオブジェクトの場合
      if ('id' in oldData) {
        return updateMapLikes(oldData as MapWithLikesCount, mapId, delta, newLikeStatus);
      }
      return oldData;
    }
  );

  // view-history キャッシュを更新（ネストされたmap構造に対応）
  const viewHistoryKey = QUERY_KEYS.viewHistoryRecent(userId, 10);
  queryClient.setQueryData<Array<{ map: MapWithLikesCount }>>(
    viewHistoryKey,
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      return oldData.map((item) => {
        if (item.map && item.map.id === mapId) {
          return {
            ...item,
            map: updateMapLikes(item.map, mapId, delta, newLikeStatus),
          };
        }
        return item;
      });
    }
  );

  // mixed-feed キャッシュを更新（InfiniteQuery、MixedFeedItem[]形式）
  queryClient.setQueriesData<InfiniteData<MixedFeedItem[]>>(
    { queryKey: QUERY_KEYS.mixedFeed() },
    (oldData) => {
      if (!oldData || !('pages' in oldData)) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((item) => {
            if (item.type === 'map' && item.data && item.data.id === mapId) {
              return {
                ...item,
                data: updateMapLikes(item.data, mapId, delta, newLikeStatus),
              };
            }
            return item;
          })
        ),
      };
    }
  );

  // collection-maps キャッシュを更新（コレクション内マップ、ネストされたmap構造）
  queryClient.setQueriesData<InfiniteData<Array<{ map: MapWithLikesCount | null }>>>(
    { queryKey: QUERY_KEYS.collectionMaps },
    (oldData) => {
      if (!oldData || !('pages' in oldData)) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((item) => {
            if (item.map && item.map.id === mapId) {
              return {
                ...item,
                map: updateMapLikes(item.map, mapId, delta, newLikeStatus),
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
 * マップのいいねをトグル（追加/削除）
 */
export function useToggleMapLike() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, ToggleMapLikeParams, MutationContext>({
    mutationFn: async ({ userId, mapId }) => {
      return toggleMapLike(userId, mapId);
    },
    onMutate: async ({ userId, mapId, isLiked }) => {
      // 楽観的更新: いいね状態を反転
      const newLikeStatus = !isLiked;
      const delta = newLikeStatus ? 1 : -1;

      updateMapLikesInCache(queryClient, mapId, userId, delta, newLikeStatus);

      return { previousLikeStatus: isLiked };
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
      // いいね一覧のキャッシュのみ無効化して再取得（別のデータ構造なのでinvalidate）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedMaps(userId) });
    },
  });
}
