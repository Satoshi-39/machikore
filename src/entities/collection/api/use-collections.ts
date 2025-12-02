/**
 * コレクション取得・操作hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  getUserCollections,
  getCollectionById,
  getPublicCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  type Collection,
  type CollectionWithUser,
} from '@/shared/api/supabase/collections';

// クエリキー
export const COLLECTION_KEYS = {
  all: ['collections'] as const,
  lists: () => [...COLLECTION_KEYS.all, 'list'] as const,
  list: (userId: string) => [...COLLECTION_KEYS.lists(), userId] as const,
  details: () => [...COLLECTION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COLLECTION_KEYS.details(), id] as const,
  public: () => [...COLLECTION_KEYS.all, 'public'] as const,
};

/**
 * ユーザーのコレクション一覧を取得
 */
export function useUserCollections(userId: string | null) {
  return useQuery<Collection[], Error>({
    queryKey: COLLECTION_KEYS.list(userId || ''),
    queryFn: () => getUserCollections(userId!),
    enabled: !!userId,
  });
}

/**
 * コレクション詳細を取得
 */
export function useCollection(collectionId: string | null) {
  return useQuery<CollectionWithUser | null, Error>({
    queryKey: COLLECTION_KEYS.detail(collectionId || ''),
    queryFn: () => getCollectionById(collectionId!),
    enabled: !!collectionId,
  });
}

/**
 * 公開コレクション一覧を取得
 */
export function usePublicCollections(limit: number = 20, offset: number = 0) {
  return useQuery<CollectionWithUser[], Error>({
    queryKey: [...COLLECTION_KEYS.public(), { limit, offset }],
    queryFn: () => getPublicCollections(limit, offset),
  });
}

/**
 * コレクションを作成
 */
export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    Collection,
    Error,
    {
      userId: string;
      name: string;
      description?: string;
      thumbnailUrl?: string;
      color?: string;
      isPublic?: boolean;
    }
  >({
    mutationFn: ({ userId, name, ...options }) =>
      createCollection(userId, name, options),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.list(userId) });
      Toast.show({
        type: 'success',
        text1: 'コレクションを作成しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      console.error('[useCreateCollection] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コレクションの作成に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}

/**
 * コレクションを更新
 */
export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    Collection,
    Error,
    {
      collectionId: string;
      userId: string;
      updates: {
        name?: string;
        description?: string | null;
        thumbnail_url?: string | null;
        color?: string | null;
        is_public?: boolean;
        order_index?: number;
      };
    }
  >({
    mutationFn: ({ collectionId, updates }) =>
      updateCollection(collectionId, updates),
    onSuccess: (_, { collectionId, userId }) => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.list(userId) });
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.detail(collectionId) });
      Toast.show({
        type: 'success',
        text1: 'コレクションを更新しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      console.error('[useUpdateCollection] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コレクションの更新に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}

/**
 * コレクションを削除
 */
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { collectionId: string; userId: string }>({
    mutationFn: ({ collectionId }) => deleteCollection(collectionId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.list(userId) });
      Toast.show({
        type: 'success',
        text1: 'コレクションを削除しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      console.error('[useDeleteCollection] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コレクションの削除に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}
