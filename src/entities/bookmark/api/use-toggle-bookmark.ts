/**
 * ブックマークトグル用hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  toggleSpotBookmark,
  toggleMapBookmark,
  moveBookmarkToFolder,
} from '@/shared/api/supabase/bookmarks';

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
        queryKey: ['bookmark-status', 'spot', userId, spotId],
      });

      const previousStatus = queryClient.getQueryData<boolean>([
        'bookmark-status',
        'spot',
        userId,
        spotId,
      ]);

      queryClient.setQueryData(
        ['bookmark-status', 'spot', userId, spotId],
        !previousStatus
      );

      return { previousStatus };
    },
    onError: (error, { userId, spotId }, context) => {
      console.error('[useToggleSpotBookmark] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'ブックマークに失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          ['bookmark-status', 'spot', userId, spotId],
          context.previousStatus
        );
      }
    },
    onSuccess: (_, { userId }) => {
      // ブックマーク一覧を更新
      queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] });
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
        queryKey: ['bookmark-status', 'map', userId, mapId],
      });

      const previousStatus = queryClient.getQueryData<boolean>([
        'bookmark-status',
        'map',
        userId,
        mapId,
      ]);

      queryClient.setQueryData(
        ['bookmark-status', 'map', userId, mapId],
        !previousStatus
      );

      return { previousStatus };
    },
    onError: (error, { userId, mapId }, context) => {
      console.error('[useToggleMapBookmark] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'ブックマークに失敗しました',
        visibilityTime: 3000,
      });
      // ロールバック
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          ['bookmark-status', 'map', userId, mapId],
          context.previousStatus
        );
      }
    },
    onSuccess: (_, { userId }) => {
      // ブックマーク一覧を更新
      queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] });
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
      queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] });
    },
    onError: (error) => {
      console.error('[useMoveBookmarkToFolder] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'フォルダの移動に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}
