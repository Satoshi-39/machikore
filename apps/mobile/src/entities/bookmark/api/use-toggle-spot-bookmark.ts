/**
 * スポットブックマーク操作hooks
 *
 * スポットデータに含まれる is_bookmarked を楽観的更新する
 */

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  bookmarkSpot,
  unbookmarkSpotFromFolder,
} from '@/shared/api/supabase/bookmarks';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import type { UUID } from '@/shared/types';
import type { BookmarkInfo } from '../model/types';

// キャッシュ更新用の最小限のスポット型
interface SpotWithBookmarkStatus {
  id: string;
  is_bookmarked?: boolean;
}

// MixedFeedItem型
interface MixedFeedItem {
  type: 'map' | 'spot' | 'ad';
  data?: SpotWithBookmarkStatus;
}

/**
 * キャッシュ内のスポットのis_bookmarkedを更新するヘルパー関数
 */
function updateSpotBookmarksInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  spotId: UUID,
  newBookmarkStatus: boolean
) {
  // ['spots', ...] プレフィックスを持つすべてのキャッシュを更新
  // 通常の配列形式
  queryClient.setQueriesData<SpotWithBookmarkStatus[]>(
    { queryKey: QUERY_KEYS.spots },
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      if ('pages' in oldData) return oldData;
      return oldData.map((spot) => {
        if (spot.id === spotId) {
          return { ...spot, is_bookmarked: newBookmarkStatus };
        }
        return spot;
      });
    }
  );

  // InfiniteQuery形式
  queryClient.setQueriesData<InfiniteData<SpotWithBookmarkStatus[]>>(
    { queryKey: QUERY_KEYS.spots },
    (oldData) => {
      if (!oldData || !('pages' in oldData)) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((spot) => {
            if (spot.id === spotId) {
              return { ...spot, is_bookmarked: newBookmarkStatus };
            }
            return spot;
          })
        ),
      };
    }
  );

  // 単一スポットキャッシュを更新
  queryClient.setQueryData<SpotWithBookmarkStatus>(
    QUERY_KEYS.spotsDetail(spotId),
    (oldData) => {
      if (!oldData) return oldData;
      return { ...oldData, is_bookmarked: newBookmarkStatus };
    }
  );

  // mixed-feed キャッシュを更新（InfiniteQuery、MixedFeedItem[]形式）
  queryClient.setQueriesData<InfiniteData<MixedFeedItem[]>>(
    { queryKey: ['mixed-feed'] },
    (oldData) => {
      if (!oldData || !('pages' in oldData)) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((item) => {
            if (item.type === 'spot' && item.data && item.data.id === spotId) {
              return {
                ...item,
                data: { ...item.data, is_bookmarked: newBookmarkStatus },
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
 * スポットをブックマークに追加（フォルダ指定可能）
 */
interface MutationContext {
  previousBookmarkStatus: boolean | undefined;
  previousBookmarkInfo: BookmarkInfo | undefined;
}

export function useBookmarkSpot() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<unknown, Error, { userId: string; spotId: string; folderId?: string | null }, MutationContext>({
    mutationFn: ({
      userId,
      spotId,
      folderId,
    }) => bookmarkSpot(userId, spotId, folderId),
    onMutate: async ({ userId, spotId, folderId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkInfo('spot', userId, spotId),
      });

      // 前の値を保存
      const previousBookmarkStatus = queryClient.getQueryData<boolean>(
        QUERY_KEYS.bookmarkStatus('spot', userId, spotId)
      );
      const previousBookmarkInfo = queryClient.getQueryData<BookmarkInfo>(
        QUERY_KEYS.bookmarkInfo('spot', userId, spotId)
      );

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
        true
      );

      // bookmarkInfoを楽観的更新（配列に追加）
      queryClient.setQueryData<BookmarkInfo>(
        QUERY_KEYS.bookmarkInfo('spot', userId, spotId),
        (old) => {
          const newEntry = { id: '', folder_id: folderId || null };
          if (!old || old.length === 0) return [newEntry];
          // 既にあるなら追加しない
          if (old.some((item) => item.folder_id === (folderId || null))) return old;
          return [...old, newEntry];
        }
      );

      // 全キャッシュの is_bookmarked を楽観的更新
      updateSpotBookmarksInCache(queryClient, spotId, true);

      return { previousBookmarkStatus, previousBookmarkInfo };
    },
    onError: (error, { userId, spotId }, context) => {
      log.error('[Bookmark] useBookmarkSpot Error:', error);

      // RLSエラー（上限到達）を検出
      const isRlsError = error.message?.toLowerCase().includes('row-level security')
        || error.message?.toLowerCase().includes('new row violates');
      const errorMessage = isRlsError
        ? t('toast.bookmarkLimitReached')
        : t('toast.bookmarkSaveFailed');

      Toast.show({
        type: 'error',
        text1: errorMessage,
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousBookmarkStatus !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
          context.previousBookmarkStatus
        );
      }
      if (context?.previousBookmarkInfo !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkInfo('spot', userId, spotId),
          context.previousBookmarkInfo
        );
      }
      // 全キャッシュの is_bookmarked もロールバック
      updateSpotBookmarksInCache(queryClient, spotId, false);
    },
    onSuccess: (_, { userId }) => {
      Toast.show({
        type: 'success',
        text1: t('toast.bookmarkSaved'),
        visibilityTime: 2000,
      });
      // ブックマーク一覧とフォルダカウントのみ再取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkedSpots(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
    },
  });
}

/**
 * スポットを特定フォルダから解除（複数フォルダ対応）
 */
export function useUnbookmarkSpotFromFolder() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({
      userId,
      spotId,
      folderId,
    }: {
      userId: string;
      spotId: string;
      folderId: string | null;
    }) => unbookmarkSpotFromFolder(userId, spotId, folderId),
    onMutate: async ({ userId, spotId, folderId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkInfo('spot', userId, spotId),
      });

      // 前の値を保存
      const previousBookmarkInfo = queryClient.getQueryData<any[]>(
        QUERY_KEYS.bookmarkInfo('spot', userId, spotId)
      );

      // bookmarkInfoから該当フォルダを削除
      const filtered = (previousBookmarkInfo || []).filter(
        (item) => item.folder_id !== folderId
      );

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkInfo('spot', userId, spotId),
        filtered
      );

      // 全てのフォルダから削除されたらステータスと全キャッシュを更新
      if (filtered.length === 0) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
          false
        );
        // 全キャッシュの is_bookmarked を楽観的更新
        updateSpotBookmarksInCache(queryClient, spotId, false);
      }

      return { previousBookmarkInfo };
    },
    onSuccess: (_, { userId }) => {
      Toast.show({
        type: 'success',
        text1: t('toast.bookmarkRemoved'),
        visibilityTime: 2000,
      });
      // ブックマーク一覧とフォルダカウントのみ再取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkedSpots(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
    },
    onError: (error, { userId, spotId }, context) => {
      log.error('[Bookmark] useUnbookmarkSpotFromFolder Error:', error);
      Toast.show({
        type: 'error',
        text1: t('toast.bookmarkRemoveFailed'),
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousBookmarkInfo !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkInfo('spot', userId, spotId),
          context.previousBookmarkInfo
        );
        // ブックマーク状態も復元
        if (Array.isArray(context.previousBookmarkInfo) && context.previousBookmarkInfo.length > 0) {
          queryClient.setQueryData(
            QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
            true
          );
          // 全キャッシュの is_bookmarked もロールバック
          updateSpotBookmarksInCache(queryClient, spotId, true);
        }
      }
    },
  });
}
