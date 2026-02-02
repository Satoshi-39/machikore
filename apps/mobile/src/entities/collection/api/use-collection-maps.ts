/**
 * コレクション内マップ操作hooks
 * cursor方式の無限スクロール対応
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { FEED_PAGE_SIZE } from '@/shared/config';
import {
  getCollectionMaps,
  addMapToCollection,
  removeMapFromCollection,
  updateCollectionMapOrder,
  getMapCollections,
  type CollectionMapWithDetails,
  type CollectionWithUser,
} from '@/shared/api/supabase/collections';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';

/**
 * コレクション内のマップ一覧を取得（無限スクロール対応）
 */
export function useCollectionMaps(collectionId: string | null, currentUserId?: string | null) {
  return useInfiniteQuery<CollectionMapWithDetails[], Error>({
    queryKey: QUERY_KEYS.collectionMapsList(collectionId || ''),
    queryFn: async ({ pageParam }) => {
      if (!collectionId) return [];
      return getCollectionMaps(collectionId, FEED_PAGE_SIZE, pageParam as number | undefined, currentUserId);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      // 取得した件数がFEED_PAGE_SIZE未満なら次のページはない
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      // 最後のアイテムのorder_indexをcursorとして返す
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.order_index;
    },
    enabled: !!collectionId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

/**
 * マップがどのコレクションに含まれているか取得
 */
export function useMapCollections(mapId: string | null, userId: string | null) {
  return useQuery<{ collection_id: string }[], Error>({
    queryKey: QUERY_KEYS.collectionMapsMapCollections(mapId || '', userId || ''),
    queryFn: () => getMapCollections(mapId!, userId!),
    enabled: !!mapId && !!userId,
  });
}

/**
 * コレクションにマップを追加（楽観的更新対応）
 */
export function useAddMapToCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { collectionId: string; mapId: string; userId: string },
    { previousMaps: InfiniteData<CollectionMapWithDetails[]> | undefined; previousDetail: CollectionWithUser | null | undefined }
  >({
    mutationFn: ({ collectionId, mapId }) =>
      addMapToCollection(collectionId, mapId).then(() => undefined),
    onMutate: async ({ collectionId, mapId }) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.collectionMapsList(collectionId) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.collectionsDetail(collectionId) });

      // スナップショットを保存
      const previousMaps = queryClient.getQueryData<InfiniteData<CollectionMapWithDetails[]>>(
        QUERY_KEYS.collectionMapsList(collectionId)
      );
      const previousDetail = queryClient.getQueryData<CollectionWithUser | null>(
        QUERY_KEYS.collectionsDetail(collectionId)
      );

      // コレクションマップに楽観的に追加
      if (previousMaps) {
        const fakeEntry: CollectionMapWithDetails = {
          id: `optimistic-${mapId}`,
          collection_id: collectionId,
          map_id: mapId,
          order_index: 0,
          created_at: new Date().toISOString(),
          map: null,
        };
        queryClient.setQueryData<InfiniteData<CollectionMapWithDetails[]>>(
          QUERY_KEYS.collectionMapsList(collectionId),
          {
            ...previousMaps,
            pages: previousMaps.pages.map((page, i) =>
              i === 0 ? [...page, fakeEntry] : page
            ),
          }
        );
      }

      // maps_countを楽観的に+1
      if (previousDetail) {
        queryClient.setQueryData<CollectionWithUser | null>(
          QUERY_KEYS.collectionsDetail(collectionId),
          { ...previousDetail, maps_count: (previousDetail.maps_count ?? 0) + 1 }
        );
      }

      return { previousMaps, previousDetail };
    },
    onError: (error, { collectionId }, context) => {
      log.error('[Collection] useAddMapToCollection Error:', error);
      // ロールバック
      if (context?.previousMaps) {
        queryClient.setQueryData(QUERY_KEYS.collectionMapsList(collectionId), context.previousMaps);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(QUERY_KEYS.collectionsDetail(collectionId), context.previousDetail);
      }
      Toast.show({
        type: 'error',
        text1: 'コレクションへの追加に失敗しました',
        visibilityTime: 3000,
      });
    },
    onSettled: (_, error, { collectionId, mapId, userId }) => {
      // サーバーと同期
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionMapsList(collectionId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionMapsMapCollections(mapId, userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsDetail(collectionId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsList(userId) });
      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'コレクションに追加しました',
          visibilityTime: 2000,
        });
      }
    },
  });
}

/**
 * コレクションからマップを削除（楽観的更新対応）
 */
export function useRemoveMapFromCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { collectionId: string; mapId: string; userId: string },
    { previousMaps: InfiniteData<CollectionMapWithDetails[]> | undefined; previousDetail: CollectionWithUser | null | undefined }
  >({
    mutationFn: ({ collectionId, mapId }) =>
      removeMapFromCollection(collectionId, mapId),
    onMutate: async ({ collectionId, mapId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.collectionMapsList(collectionId) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.collectionsDetail(collectionId) });

      const previousMaps = queryClient.getQueryData<InfiniteData<CollectionMapWithDetails[]>>(
        QUERY_KEYS.collectionMapsList(collectionId)
      );
      const previousDetail = queryClient.getQueryData<CollectionWithUser | null>(
        QUERY_KEYS.collectionsDetail(collectionId)
      );

      // コレクションマップから楽観的に削除
      if (previousMaps) {
        queryClient.setQueryData<InfiniteData<CollectionMapWithDetails[]>>(
          QUERY_KEYS.collectionMapsList(collectionId),
          {
            ...previousMaps,
            pages: previousMaps.pages.map((page) =>
              page.filter((item) => item.map_id !== mapId)
            ),
          }
        );
      }

      // maps_countを楽観的に-1
      if (previousDetail) {
        queryClient.setQueryData<CollectionWithUser | null>(
          QUERY_KEYS.collectionsDetail(collectionId),
          { ...previousDetail, maps_count: Math.max(0, (previousDetail.maps_count ?? 0) - 1) }
        );
      }

      return { previousMaps, previousDetail };
    },
    onError: (error, { collectionId }, context) => {
      log.error('[Collection] useRemoveMapFromCollection Error:', error);
      if (context?.previousMaps) {
        queryClient.setQueryData(QUERY_KEYS.collectionMapsList(collectionId), context.previousMaps);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(QUERY_KEYS.collectionsDetail(collectionId), context.previousDetail);
      }
      Toast.show({
        type: 'error',
        text1: 'コレクションからの削除に失敗しました',
        visibilityTime: 3000,
      });
    },
    onSettled: (_, error, { collectionId, mapId, userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionMapsList(collectionId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionMapsMapCollections(mapId, userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsDetail(collectionId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsList(userId) });
      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'コレクションから削除しました',
          visibilityTime: 2000,
        });
      }
    },
  });
}

/**
 * コレクション内マップの並び順を更新
 */
export function useUpdateCollectionMapOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { collectionId: string; mapId: string; orderIndex: number }
  >({
    mutationFn: ({ collectionId, mapId, orderIndex }) =>
      updateCollectionMapOrder(collectionId, mapId, orderIndex),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.collectionMapsList(collectionId),
      });
    },
    onError: (error) => {
      log.error('[Collection] useUpdateCollectionMapOrder Error:', error);
    },
  });
}
