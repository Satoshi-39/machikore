/**
 * マップブックマーク操作hooks
 *
 * マップデータに含まれる is_bookmarked と bookmarks_count を楽観的更新する
 * - 楽観的更新: 現在マウントされている全キャッシュを即座に更新（APIリクエストなし）
 * - invalidateQueries: ブックマーク一覧など別のデータ構造のみ
 */

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  bookmarkMap,
  unbookmarkMapFromFolder,
} from '@/shared/api/supabase/bookmarks';
import { log } from '@/shared/config/logger';
import type { UUID, MapArticleData } from '@/shared/types';
import type { BookmarkInfo } from '../model/types';

// キャッシュ更新用の最小限のマップ型
interface MapWithBookmarksCount {
  id: string;
  bookmarks_count?: number | null;
  is_bookmarked?: boolean;
}

// MixedFeedItem型（循環参照を避けるためローカル定義）
interface MixedFeedItem {
  type: 'map' | 'spot' | 'ad';
  data?: MapWithBookmarksCount;
}

/**
 * マップのbookmarks_countとis_bookmarkedを更新するユーティリティ
 */
function updateMapBookmarks(map: MapWithBookmarksCount, mapId: string, delta: number, newBookmarkStatus: boolean): MapWithBookmarksCount {
  if (map.id !== mapId) return map;
  return {
    ...map,
    bookmarks_count: Math.max(0, (map.bookmarks_count || 0) + delta),
    is_bookmarked: newBookmarkStatus,
  };
}

/**
 * キャッシュ内のマップのbookmarks_countとis_bookmarkedを更新するヘルパー関数
 * TkDodo推奨の階層構造キーを使用
 */
function updateMapBookmarksInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  mapId: UUID,
  userId: UUID,
  delta: number,
  newBookmarkStatus: boolean
) {
  // マップリスト系キャッシュを一括更新（['maps', 'list', *] にマッチ）
  queryClient.setQueriesData<MapWithBookmarksCount[] | InfiniteData<MapWithBookmarksCount[]>>(
    { queryKey: QUERY_KEYS.mapsLists() },
    (oldData) => {
      if (!oldData) return oldData;
      // InfiniteData形式の場合
      if ('pages' in oldData) {
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((map) => updateMapBookmarks(map, mapId, delta, newBookmarkStatus))
          ),
        };
      }
      // 通常の配列形式
      if (Array.isArray(oldData)) {
        return oldData.map((map) => updateMapBookmarks(map, mapId, delta, newBookmarkStatus));
      }
      return oldData;
    }
  );

  // マップ詳細系キャッシュを一括更新（['maps', 'detail', *] にマッチ）
  queryClient.setQueriesData<MapWithBookmarksCount | MapArticleData>(
    { queryKey: QUERY_KEYS.mapsDetails() },
    (oldData) => {
      if (!oldData) return oldData;
      // MapArticleData形式の場合
      if ('map' in oldData && oldData.map) {
        if (oldData.map.id !== mapId) return oldData;
        return {
          ...oldData,
          map: {
            ...oldData.map,
            bookmarks_count: Math.max(0, (oldData.map.bookmarks_count || 0) + delta),
            is_bookmarked: newBookmarkStatus,
          },
        };
      }
      // 通常のマップオブジェクトの場合
      if ('id' in oldData) {
        return updateMapBookmarks(oldData as MapWithBookmarksCount, mapId, delta, newBookmarkStatus);
      }
      return oldData;
    }
  );

  // view-history キャッシュを更新（ネストされたmap構造に対応）
  const viewHistoryKey = QUERY_KEYS.viewHistoryRecent(userId, 10);
  queryClient.setQueryData<Array<{ map: MapWithBookmarksCount }>>(
    viewHistoryKey,
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      return oldData.map((item) => {
        if (item.map && item.map.id === mapId) {
          return {
            ...item,
            map: updateMapBookmarks(item.map, mapId, delta, newBookmarkStatus),
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
                data: updateMapBookmarks(item.data, mapId, delta, newBookmarkStatus),
              };
            }
            return item;
          })
        ),
      };
    }
  );
}

interface MutationContext {
  previousBookmarkStatus: boolean | undefined;
  previousBookmarkInfo: BookmarkInfo | undefined;
}

/**
 * マップをブックマークに追加（フォルダ指定可能）
 */
export function useBookmarkMap() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { userId: string; mapId: string; folderId?: string | null }, MutationContext>({
    mutationFn: ({
      userId,
      mapId,
      folderId,
    }) => bookmarkMap(userId, mapId, folderId),
    onMutate: async ({ userId, mapId, folderId }) => {
      // 楽観的更新: ブックマーク状態とマップデータを即座に更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkInfo('map', userId, mapId),
      });

      // 前の値を保存
      const previousBookmarkStatus = queryClient.getQueryData<boolean>(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId)
      );
      const previousBookmarkInfo = queryClient.getQueryData<BookmarkInfo>(
        QUERY_KEYS.bookmarkInfo('map', userId, mapId)
      );

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId),
        true
      );

      // bookmarkInfoを楽観的更新（配列に追加）
      queryClient.setQueryData<BookmarkInfo>(
        QUERY_KEYS.bookmarkInfo('map', userId, mapId),
        (old) => {
          const newEntry = { id: '', folder_id: folderId || null };
          if (!old || old.length === 0) return [newEntry];
          // 既にあるなら追加しない
          if (old.some((item) => item.folder_id === (folderId || null))) return old;
          return [...old, newEntry];
        }
      );

      // マップデータ内のbookmarks_countとis_bookmarkedを楽観的更新
      updateMapBookmarksInCache(queryClient, mapId, userId, 1, true);

      return { previousBookmarkStatus, previousBookmarkInfo };
    },
    onError: (error, { userId, mapId }, context) => {
      log.error('[Bookmark] useBookmarkMap Error:', error);
      Toast.show({
        type: 'error',
        text1: '保存に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousBookmarkStatus !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkStatus('map', userId, mapId),
          context.previousBookmarkStatus
        );
      }
      if (context?.previousBookmarkInfo !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkInfo('map', userId, mapId),
          context.previousBookmarkInfo
        );
      }
      // マップデータも元に戻す
      updateMapBookmarksInCache(queryClient, mapId, userId, -1, false);
    },
    onSuccess: (_, { userId }) => {
      Toast.show({
        type: 'success',
        text1: '保存しました',
        visibilityTime: 2000,
      });
      // ブックマーク一覧とフォルダカウントのみ無効化（別のデータ構造なのでinvalidate）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkedMaps(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
    },
  });
}

interface UnbookmarkContext {
  previousBookmarkInfo: BookmarkInfo | undefined;
  wasFullyUnbookmarked: boolean;
}

/**
 * マップを特定フォルダから解除（複数フォルダ対応）
 */
export function useUnbookmarkMapFromFolder() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: string; mapId: string; folderId: string | null }, UnbookmarkContext>({
    mutationFn: ({
      userId,
      mapId,
      folderId,
    }) => unbookmarkMapFromFolder(userId, mapId, folderId),
    onMutate: async ({ userId, mapId, folderId }) => {
      // 楽観的更新: ブックマーク状態とマップデータを即座に更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkInfo('map', userId, mapId),
      });

      // 前の値を保存
      const previousBookmarkInfo = queryClient.getQueryData<BookmarkInfo>(
        QUERY_KEYS.bookmarkInfo('map', userId, mapId)
      );

      // bookmarkInfoから該当フォルダを削除
      const filtered = (previousBookmarkInfo || []).filter(
        (item) => item.folder_id !== folderId
      );

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkInfo('map', userId, mapId),
        filtered
      );

      // 全てのフォルダから削除されたかどうかを記録
      const wasFullyUnbookmarked = filtered.length === 0;

      // 全てのフォルダから削除されたらステータスも更新
      if (wasFullyUnbookmarked) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkStatus('map', userId, mapId),
          false
        );
        // マップデータのbookmarks_countとis_bookmarkedも楽観的更新（-1、false）
        updateMapBookmarksInCache(queryClient, mapId, userId, -1, false);
      }

      return { previousBookmarkInfo, wasFullyUnbookmarked };
    },
    onSuccess: (_, { userId }) => {
      Toast.show({
        type: 'success',
        text1: '保存を解除しました',
        visibilityTime: 2000,
      });
      // ブックマーク一覧とフォルダカウントのみ無効化（別のデータ構造なのでinvalidate）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkedMaps(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
    },
    onError: (error, { userId, mapId }, context) => {
      log.error('[Bookmark] useUnbookmarkMapFromFolder Error:', error);
      Toast.show({
        type: 'error',
        text1: '保存の解除に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousBookmarkInfo !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkInfo('map', userId, mapId),
          context.previousBookmarkInfo
        );
        // ブックマーク状態も復元
        if (Array.isArray(context.previousBookmarkInfo) && context.previousBookmarkInfo.length > 0) {
          queryClient.setQueryData(
            QUERY_KEYS.bookmarkStatus('map', userId, mapId),
            true
          );
        }
      }
      // 完全に解除されていた場合はマップデータも元に戻す
      if (context?.wasFullyUnbookmarked) {
        updateMapBookmarksInCache(queryClient, mapId, userId, 1, true);
      }
    },
  });
}
