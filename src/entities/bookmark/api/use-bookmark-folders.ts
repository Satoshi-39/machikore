/**
 * ブックマークフォルダ用hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBookmarkFolders,
  createBookmarkFolder,
  updateBookmarkFolder,
  deleteBookmarkFolder,
  type BookmarkFolder,
  type BookmarkFolderType,
} from '@/shared/api/supabase/bookmarks';

const QUERY_KEY = ['bookmark-folders'];

/**
 * ユーザーのブックマークフォルダ一覧を取得
 * @param folderType 'spots' | 'maps' でフィルタ（省略時は全件）
 */
export function useBookmarkFolders(
  userId: string | null | undefined,
  folderType?: BookmarkFolderType
) {
  return useQuery<BookmarkFolder[], Error>({
    queryKey: [...QUERY_KEY, userId, folderType],
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
      color,
    }: {
      userId: string;
      name: string;
      folderType: BookmarkFolderType;
      color?: string;
    }) => createBookmarkFolder(userId, name, folderType, color),
    onSuccess: (_, { userId, folderType }) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, userId, folderType] });
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
      updates: { name?: string; color?: string | null; order_index?: number };
      userId: string;
    }) => updateBookmarkFolder(folderId, updates),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, userId] });
    },
  });
}

/**
 * ブックマークフォルダを削除
 */
export function useDeleteBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId }: { folderId: string; userId: string }) =>
      deleteBookmarkFolder(folderId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, userId] });
      // ブックマーク一覧も更新（フォルダが消えるため）
      queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] });
    },
  });
}
