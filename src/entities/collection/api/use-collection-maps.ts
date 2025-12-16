/**
 * コレクション内マップ操作hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  getCollectionMaps,
  addMapToCollection,
  removeMapFromCollection,
  updateCollectionMapOrder,
  getMapCollections,
  type CollectionMapWithDetails,
} from '@/shared/api/supabase/collections';
import { COLLECTION_KEYS } from './use-collections';
import { log } from '@/shared/config/logger';

// クエリキー
export const COLLECTION_MAPS_KEYS = {
  all: ['collection-maps'] as const,
  list: (collectionId: string) => [...COLLECTION_MAPS_KEYS.all, collectionId] as const,
  mapCollections: (mapId: string, userId: string) =>
    [...COLLECTION_MAPS_KEYS.all, 'map', mapId, userId] as const,
};

/**
 * コレクション内のマップ一覧を取得
 */
export function useCollectionMaps(collectionId: string | null) {
  return useQuery<CollectionMapWithDetails[], Error>({
    queryKey: COLLECTION_MAPS_KEYS.list(collectionId || ''),
    queryFn: () => getCollectionMaps(collectionId!),
    enabled: !!collectionId,
  });
}

/**
 * マップがどのコレクションに含まれているか取得
 */
export function useMapCollections(mapId: string | null, userId: string | null) {
  return useQuery<{ collection_id: string }[], Error>({
    queryKey: COLLECTION_MAPS_KEYS.mapCollections(mapId || '', userId || ''),
    queryFn: () => getMapCollections(mapId!, userId!),
    enabled: !!mapId && !!userId,
  });
}

/**
 * コレクションにマップを追加
 */
export function useAddMapToCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { collectionId: string; mapId: string; userId: string }
  >({
    mutationFn: ({ collectionId, mapId }) =>
      addMapToCollection(collectionId, mapId).then(() => undefined),
    onSuccess: (_, { collectionId, mapId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_MAPS_KEYS.list(collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_MAPS_KEYS.mapCollections(mapId, userId),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.detail(collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.list(userId),
      });
      Toast.show({
        type: 'success',
        text1: 'コレクションに追加しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Collection] useAddMapToCollection Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コレクションへの追加に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}

/**
 * コレクションからマップを削除
 */
export function useRemoveMapFromCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { collectionId: string; mapId: string; userId: string }
  >({
    mutationFn: ({ collectionId, mapId }) =>
      removeMapFromCollection(collectionId, mapId),
    onSuccess: (_, { collectionId, mapId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_MAPS_KEYS.list(collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_MAPS_KEYS.mapCollections(mapId, userId),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.detail(collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.list(userId),
      });
      Toast.show({
        type: 'success',
        text1: 'コレクションから削除しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Collection] useRemoveMapFromCollection Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コレクションからの削除に失敗しました',
        visibilityTime: 3000,
      });
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
        queryKey: COLLECTION_MAPS_KEYS.list(collectionId),
      });
    },
    onError: (error) => {
      log.error('[Collection] useUpdateCollectionMapOrder Error:', error);
    },
  });
}
