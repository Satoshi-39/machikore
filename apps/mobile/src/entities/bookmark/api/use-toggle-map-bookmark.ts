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
    onMutate: async ({ userId, mapId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId),
      });

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId),
        true
      );
    },
    onError: (error, { userId, mapId }) => {
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
    },
    onError: (error) => {
      log.error('[Bookmark] useUnbookmarkMapFromFolder Error:', error);
      Toast.show({
        type: 'error',
        text1: '保存の解除に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}
