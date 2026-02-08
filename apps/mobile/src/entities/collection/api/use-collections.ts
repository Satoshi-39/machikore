/**
 * コレクション取得・操作hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
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
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { ThumbnailCrop } from '@/shared/lib/image';

/**
 * ユーザーのコレクション一覧を取得
 */
export function useUserCollections(userId: string | null) {
  return useQuery<Collection[], Error>({
    queryKey: QUERY_KEYS.collectionsList(userId || ''),
    queryFn: () => getUserCollections(userId!),
    enabled: !!userId,
  });
}

/**
 * コレクション詳細を取得
 */
export function useCollection(collectionId: string | null, currentUserId?: string | null) {
  return useQuery<CollectionWithUser | null, Error>({
    queryKey: QUERY_KEYS.collectionsDetail(collectionId || ''),
    queryFn: () => getCollectionById(collectionId!, currentUserId),
    enabled: !!collectionId,
  });
}

/**
 * 公開コレクション一覧を取得
 */
export function usePublicCollections(limit: number = 20, offset: number = 0) {
  return useQuery<CollectionWithUser[], Error>({
    queryKey: [...QUERY_KEYS.collectionsPublic(), { limit, offset }],
    queryFn: () => getPublicCollections(limit, offset),
  });
}

/**
 * コレクションを作成
 */
export function useCreateCollection() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<
    Collection,
    Error,
    {
      userId: string;
      name: string;
      description?: string;
      thumbnailUrl?: string;
      thumbnailCrop?: ThumbnailCrop | null;
      isPublic?: boolean;
    }
  >({
    mutationFn: ({ userId, name, ...options }) =>
      createCollection(userId, name, options),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsList(userId) });
      Toast.show({
        type: 'success',
        text1: t('toast.collectionCreated'),
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Collection] useCreateCollection Error:', error);
      Toast.show({
        type: 'error',
        text1: t('toast.collectionCreateFailed'),
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
  const { t } = useI18n();

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
        thumbnail_crop?: ThumbnailCrop | null;
        color?: string | null;
        is_public?: boolean;
        order_index?: number;
      };
    }
  >({
    mutationFn: ({ collectionId, userId, updates }) =>
      updateCollection(collectionId, userId, updates),
    onSuccess: (_, { collectionId, userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsDetail(collectionId) });
      Toast.show({
        type: 'success',
        text1: t('toast.collectionUpdated'),
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Collection] useUpdateCollection Error:', error);
      Toast.show({
        type: 'error',
        text1: t('toast.collectionUpdateFailed'),
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
  const { t } = useI18n();

  return useMutation<void, Error, { collectionId: string; userId: string }>({
    mutationFn: ({ collectionId, userId }) => deleteCollection(collectionId, userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsList(userId) });
      Toast.show({
        type: 'success',
        text1: t('toast.collectionDeleted'),
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Collection] useDeleteCollection Error:', error);
      Toast.show({
        type: 'error',
        text1: t('toast.collectionDeleteFailed'),
        visibilityTime: 3000,
      });
    },
  });
}
