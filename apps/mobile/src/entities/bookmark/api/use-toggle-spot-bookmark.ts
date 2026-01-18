/**
 * スポットブックマーク操作hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  bookmarkSpot,
  unbookmarkSpotFromFolder,
} from '@/shared/api/supabase/bookmarks';
import { log } from '@/shared/config/logger';

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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkedSpots(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkInfo('spot', userId, spotId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkStatus('spot', userId, spotId) });
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
      Toast.show({
        type: 'success',
        text1: '保存を解除しました',
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkedSpots(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
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
