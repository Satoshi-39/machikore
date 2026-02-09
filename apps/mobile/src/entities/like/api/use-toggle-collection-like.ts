/**
 * コレクションいいねをトグルするmutation
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
import { toggleCollectionLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID } from '@/shared/types';

interface ToggleCollectionLikeParams {
  userId: UUID;
  collectionId: UUID;
  /** 現在のいいね状態（楽観的更新に使用） */
  isLiked: boolean;
}

interface MutationContext {
  previousLikeStatus: boolean | undefined;
}

// キャッシュ更新用の最小限のコレクション型
interface CollectionWithLikesCount {
  id: string;
  likes_count?: number | null;
  is_liked?: boolean;
}

/**
 * コレクションのlikes_countとis_likedを更新するユーティリティ
 */
function updateCollectionLikes(
  collection: CollectionWithLikesCount,
  collectionId: string,
  delta: number,
  newLikeStatus: boolean
): CollectionWithLikesCount {
  if (collection.id !== collectionId) return collection;
  return {
    ...collection,
    likes_count: Math.max(0, (collection.likes_count || 0) + delta),
    is_liked: newLikeStatus,
  };
}

/**
 * キャッシュ内のコレクションのlikes_countとis_likedを更新するヘルパー関数
 */
function updateCollectionLikesInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  collectionId: UUID,
  delta: number,
  newLikeStatus: boolean
) {
  // コレクションリスト系キャッシュを一括更新（['collections', 'list', *] にマッチ）
  queryClient.setQueriesData<CollectionWithLikesCount[]>(
    { queryKey: QUERY_KEYS.collectionsLists() },
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      return oldData.map((collection) =>
        updateCollectionLikes(collection, collectionId, delta, newLikeStatus)
      );
    }
  );

  // コレクション詳細系キャッシュを一括更新（['collections', 'detail', *] にマッチ）
  queryClient.setQueriesData<CollectionWithLikesCount>(
    { queryKey: QUERY_KEYS.collectionsDetails() },
    (oldData) => {
      if (!oldData || !('id' in oldData)) return oldData;
      return updateCollectionLikes(oldData, collectionId, delta, newLikeStatus);
    }
  );
}

/**
 * コレクションのいいねをトグル（追加/削除）
 */
export function useToggleCollectionLike() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<boolean, Error, ToggleCollectionLikeParams, MutationContext>({
    mutationFn: async ({ userId, collectionId }) => {
      return toggleCollectionLike(userId, collectionId);
    },
    onMutate: async ({ collectionId, isLiked }) => {
      const newLikeStatus = !isLiked;
      const delta = newLikeStatus ? 1 : -1;

      // 進行中のリフェッチをキャンセル（楽観的更新を上書きさせない）
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.collectionsDetail(collectionId) });

      // 楽観的更新
      updateCollectionLikesInCache(queryClient, collectionId, delta, newLikeStatus);

      return { previousLikeStatus: isLiked };
    },
    onError: (err, { userId, collectionId }, context) => {
      log.error('[Like] useToggleCollectionLike Error:', err);
      Toast.show({
        type: 'error',
        text1: t('toast.likeFailed'),
        visibilityTime: 3000,
      });
      if (context?.previousLikeStatus !== undefined) {
        queryClient.setQueryData<boolean>(
          QUERY_KEYS.collectionLikeStatus(userId, collectionId),
          context.previousLikeStatus
        );
        // いいね数とis_likedも元に戻す
        const delta = context.previousLikeStatus ? 1 : -1;
        updateCollectionLikesInCache(queryClient, collectionId, delta, context.previousLikeStatus);
      }
    },
    onSettled: (_data, _error, { userId, collectionId }) => {
      // 成功・失敗どちらでもリフェッチして整合性を保証
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collectionsDetail(collectionId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedCollections(userId) });
    },
  });
}
