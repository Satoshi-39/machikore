/**
 * ブックマークフォルダ用hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  getBookmarkFolders,
  createBookmarkFolder,
  updateBookmarkFolder,
  deleteBookmarkFolder,
  type BookmarkFolder,
  type BookmarkFolderType,
} from '@/shared/api/supabase/bookmarks';

/**
 * ユーザーのブックマークフォルダ一覧を取得
 * @param folderType 'spots' | 'maps' でフィルタ（省略時は全件）
 */
export function useBookmarkFolders(
  userId: string | null | undefined,
  folderType?: BookmarkFolderType
) {
  return useQuery<BookmarkFolder[], Error>({
    queryKey: QUERY_KEYS.bookmarkFoldersList(userId || '', folderType),
    queryFn: () => {
      if (!userId) return [];
      return getBookmarkFolders(userId, folderType);
    },
    enabled: !!userId,
  });
}

/**
 * ブックマークフォルダを作成
 */
export function useCreateBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      name,
      folderType,
    }: {
      userId: string;
      name: string;
      folderType: BookmarkFolderType;
    }) => createBookmarkFolder(userId, name, folderType),
    onSuccess: (newFolder, { userId, folderType }) => {
      // 楽観的更新: 作成されたフォルダをキャッシュに追加
      queryClient.setQueryData<BookmarkFolder[]>(
        QUERY_KEYS.bookmarkFoldersList(userId, folderType),
        (oldData) => {
          if (!oldData) return [newFolder];
          return [...oldData, newFolder];
        }
      );
      // フォルダカウントも更新
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
    },
  });
}

/**
 * ブックマークフォルダを更新
 */
export function useUpdateBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      folderId,
      updates,
    }: {
      folderId: string;
      updates: { name?: string; order_index?: number };
      userId: string;
      folderType: BookmarkFolderType;
    }) => updateBookmarkFolder(folderId, updates),
    onSuccess: (_, { userId, folderType }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarkFoldersList(userId, folderType) });
    },
  });
}

/**
 * ブックマークフォルダを削除
 */
export function useDeleteBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId }: { folderId: string; userId: string; folderType?: BookmarkFolderType }) =>
      deleteBookmarkFolder(folderId),
    onMutate: async ({ folderId, userId, folderType }) => {
      // キャンセル
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.bookmarkFoldersList(userId, folderType) });

      // 前の値を保存
      const previousFolders = queryClient.getQueryData<BookmarkFolder[]>(
        QUERY_KEYS.bookmarkFoldersList(userId, folderType)
      );

      // 楽観的更新: フォルダを即座に削除
      queryClient.setQueryData<BookmarkFolder[]>(
        QUERY_KEYS.bookmarkFoldersList(userId, folderType),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((folder) => folder.id !== folderId);
        }
      );

      return { previousFolders, folderType };
    },
    onError: (_, { userId }, context) => {
      // ロールバック
      if (context?.previousFolders) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarkFoldersList(userId, context.folderType),
          context.previousFolders
        );
      }
    },
    onSuccess: (_, { userId }) => {
      // ブックマーク一覧とカウントも更新
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folderBookmarkCounts(userId) });
    },
  });
}
