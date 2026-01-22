/**
 * マップブックマーク操作hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  bookmarkMap,
  unbookmarkMapFromFolder,
} from '@/shared/api/supabase/bookmarks';
import { log } from '@/shared/config/logger';

/**
 * マップをブックマークに追加（フォルダ指定可能）
 */
export function useBookmarkMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      mapId,
      folderId,
    }: {
      userId: string;
      mapId: string;
      folderId?: string | null;
    }) => bookmarkMap(userId, mapId, folderId),
    onMutate: async ({ userId, mapId, folderId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkInfo('map', userId, mapId),
      });

      // 前の値を保存
      const previousBookmarkInfo = queryClient.getQueryData(
        QUERY_KEYS.bookmarkInfo('map', userId, mapId)
      );

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId),
        true
      );

      // bookmarkInfoを楽観的更新（配列に追加）
      queryClient.setQueryData(
        QUERY_KEYS.bookmarkInfo('map', userId, mapId),
        (old: any[] | undefined) => {
          const newEntry = { folder_id: folderId || null };
          if (!old || old.length === 0) return [newEntry];
          // 既にあるなら追加しない
          if (old.some((item) => item.folder_id === (folderId || null))) return old;
          return [...old, newEntry];
        }
      );

      return { previousBookmarkInfo };
    },
    onError: (error, { userId, mapId }, context) => {
      log.error('[Bookmark] useBookmarkMap Error:', error);
      Toast.show({
        type: 'error',
        text1: '保存に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId),
        false
      );
      // bookmarkInfoもロールバック
      if (context?.previousBookmarkInfo !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkInfo('map', userId, mapId),
          context.previousBookmarkInfo
        );
      }
    },
    onSuccess: (_, { userId, mapId }) => {
      Toast.show({
        type: 'success',
        text1: '保存しました',
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkedMaps(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkInfo('map', userId, mapId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId) });
      // マップ一覧のis_bookmarkedを更新するためにinvalidate
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapsDetail(mapId, userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mixedFeed() });
    },
  });
}

/**
 * マップを特定フォルダから解除（複数フォルダ対応）
 */
export function useUnbookmarkMapFromFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      mapId,
      folderId,
    }: {
      userId: string;
      mapId: string;
      folderId: string | null;
    }) => unbookmarkMapFromFolder(userId, mapId, folderId),
    onMutate: async ({ userId, mapId, folderId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkInfo('map', userId, mapId),
      });

      // 前の値を保存
      const previousBookmarkInfo = queryClient.getQueryData(
        QUERY_KEYS.bookmarkInfo('map', userId, mapId)
      );

      // bookmarkInfoから該当フォルダを削除
      queryClient.setQueryData(
        QUERY_KEYS.bookmarkInfo('map', userId, mapId),
        (old: any[] | undefined) => {
          if (!old) return [];
          const filtered = old.filter((item) => item.folder_id !== folderId);
          // 全てのフォルダから削除されたらステータスも更新
          if (filtered.length === 0) {
            queryClient.setQueryData(
              QUERY_KEYS.bookmarkStatus('map', userId, mapId),
              false
            );
          }
          return filtered;
        }
      );

      return { previousBookmarkInfo };
    },
    onSuccess: (_, { userId, mapId }) => {
      Toast.show({
        type: 'success',
        text1: '保存を解除しました',
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkedMaps(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkInfo('map', userId, mapId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId) });
      // マップ一覧のis_bookmarkedを更新するためにinvalidate
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapsDetail(mapId, userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mixedFeed() });
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
    },
  });
}
