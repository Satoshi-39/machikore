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
import type { UUID } from '@/shared/types';

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
export function useBookmarkSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      spotId,
      folderId,
    }: {
      userId: string;
      spotId: string;
      folderId?: string | null;
    }) => bookmarkSpot(userId, spotId, folderId),
    onMutate: async ({ userId, spotId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
      });

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
        true
      );

      // 全キャッシュの is_bookmarked を楽観的更新
      updateSpotBookmarksInCache(queryClient, spotId, true);
    },
    onError: (error, { userId, spotId }) => {
      log.error('[Bookmark] useBookmarkSpot Error:', error);
      Toast.show({
        type: 'error',
        text1: '保存に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
        false
      );
      // 全キャッシュの is_bookmarked もロールバック
      updateSpotBookmarksInCache(queryClient, spotId, false);
    },
    onSuccess: (_, { userId }) => {
      Toast.show({
        type: 'success',
        text1: '保存しました',
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
        text1: '保存を解除しました',
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
        text1: '保存の解除に失敗しました',
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
