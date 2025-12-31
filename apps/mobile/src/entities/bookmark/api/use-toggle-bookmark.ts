/**
 * ブックマークトグル用hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  toggleSpotBookmark,
  toggleMapBookmark,
  moveBookmarkToFolder,
  bookmarkSpot,
  unbookmarkSpot,
  bookmarkMap,
  unbookmarkMap,
  unbookmarkSpotFromFolder,
  unbookmarkMapFromFolder,
} from '@/shared/api/supabase/bookmarks';
import { log } from '@/shared/config/logger';

/**
 * スポットのブックマークをトグル
 */
export function useToggleSpotBookmark() {
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
    }) => toggleSpotBookmark(userId, spotId, folderId),
    onMutate: async ({ userId, spotId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
      });

      const previousStatus = queryClient.getQueryData<boolean>(
        QUERY_KEYS.bookmarkStatus('spot', userId, spotId)
      );

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
        !previousStatus
      );

      return { previousStatus };
    },
    onError: (error, { userId, spotId }, context) => {
      log.error('[Bookmark] useToggleSpotBookmark Error:', error);
      Toast.show({
        type: 'error',
        text1: 'ブックマークに失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
          context.previousStatus
        );
      }
    },
    onSuccess: (_, { userId }) => {
      // ブックマーク一覧を更新
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
    },
  });
}

/**
 * マップのブックマークをトグル
 */
export function useToggleMapBookmark() {
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
    }) => toggleMapBookmark(userId, mapId, folderId),
    onMutate: async ({ userId, mapId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId),
      });

      const previousStatus = queryClient.getQueryData<boolean>(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId)
      );

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId),
        !previousStatus
      );

      return { previousStatus };
    },
    onError: (error, { userId, mapId }, context) => {
      log.error('[Bookmark] useToggleMapBookmark Error:', error);
      Toast.show({
        type: 'error',
        text1: 'ブックマークに失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkStatus('map', userId, mapId),
          context.previousStatus
        );
      }
    },
    onSuccess: (_, { userId }) => {
      // ブックマーク一覧を更新
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
    },
  });
}

/**
 * ブックマークを別のフォルダに移動
 */
export function useMoveBookmarkToFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookmarkId,
      folderId,
    }: {
      bookmarkId: string;
      folderId: string | null;
      userId: string;
    }) => moveBookmarkToFolder(bookmarkId, folderId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
    },
    onError: (error) => {
      log.error('[Bookmark] useMoveBookmarkToFolder Error:', error);
      Toast.show({
        type: 'error',
        text1: 'フォルダの移動に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
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
    },
    onSuccess: (_, { userId, spotId }) => {
      Toast.show({
        type: 'success',
        text1: '保存しました',
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkInfo('spot', userId, spotId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkStatus('spot', userId, spotId) });
    },
  });
}

/**
 * スポットのブックマークを解除
 */
export function useUnbookmarkSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      spotId,
    }: {
      userId: string;
      spotId: string;
    }) => unbookmarkSpot(userId, spotId),
    onMutate: async ({ userId, spotId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
      });

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
        false
      );
    },
    onError: (error, { userId, spotId }) => {
      log.error('[Bookmark] useUnbookmarkSpot Error:', error);
      Toast.show({
        type: 'error',
        text1: '保存の解除に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('spot', userId, spotId),
        true
      );
    },
    onSuccess: (_, { userId, spotId }) => {
      Toast.show({
        type: 'success',
        text1: '保存を解除しました',
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkInfo('spot', userId, spotId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkStatus('spot', userId, spotId) });
    },
  });
}

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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkInfo('map', userId, mapId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId) });
    },
  });
}

/**
 * マップのブックマークを解除
 */
export function useUnbookmarkMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      mapId,
    }: {
      userId: string;
      mapId: string;
    }) => unbookmarkMap(userId, mapId),
    onMutate: async ({ userId, mapId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId),
      });

      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId),
        false
      );
    },
    onError: (error, { userId, mapId }) => {
      log.error('[Bookmark] useUnbookmarkMap Error:', error);
      Toast.show({
        type: 'error',
        text1: '保存の解除に失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      queryClient.setQueryData(
        QUERY_KEYS.bookmarkStatus('map', userId, mapId),
        true
      );
    },
    onSuccess: (_, { userId, mapId }) => {
      Toast.show({
        type: 'success',
        text1: '保存を解除しました',
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkInfo('map', userId, mapId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkStatus('map', userId, mapId) });
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
    onSuccess: (_, { userId, spotId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkInfo('spot', userId, spotId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkStatus('spot', userId, spotId) });
    },
    onError: (error) => {
      log.error('[Bookmark] useUnbookmarkSpotFromFolder Error:', error);
      Toast.show({
        type: 'error',
        text1: '保存の解除に失敗しました',
        visibilityTime: 3000,
      });
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
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
