/**
 * ブックマークフォルダ操作
 */

import { supabase, handleSupabaseError } from '../client';
import type { BookmarkFolder, BookmarkFolderType } from './types';

/**
 * ユーザーのブックマークフォルダ一覧を取得
 * @param folderType 'spots' | 'maps' でフィルタ（省略時は全件）
 */
export async function getBookmarkFolders(
  userId: string,
  folderType?: BookmarkFolderType
): Promise<BookmarkFolder[]> {
  let query = supabase
    .from('bookmark_folders')
    .select('*')
    .eq('user_id', userId);

  if (folderType) {
    query = query.eq('folder_type', folderType);
  }

  const { data, error } = await query.order('order_index', { ascending: true });

  if (error) {
    handleSupabaseError('getBookmarkFolders', error);
  }

  return data || [];
}

/**
 * ブックマークフォルダを作成
 */
export async function createBookmarkFolder(
  userId: string,
  name: string,
  folderType: BookmarkFolderType
): Promise<BookmarkFolder> {
  // 同じタイプのフォルダ内で最大のorder_indexを取得
  const { data: existing } = await supabase
    .from('bookmark_folders')
    .select('order_index')
    .eq('user_id', userId)
    .eq('folder_type', folderType)
    .order('order_index', { ascending: false })
    .limit(1);

  const lastOrderIndex = existing?.[0]?.order_index ?? -1;
  const nextOrderIndex = lastOrderIndex + 1;

  const { data, error } = await supabase
    .from('bookmark_folders')
    .insert({
      user_id: userId,
      name,
      folder_type: folderType,
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) {
    handleSupabaseError('createBookmarkFolder', error);
  }

  return data;
}

/**
 * ブックマークフォルダを更新
 */
export async function updateBookmarkFolder(
  folderId: string,
  updates: { name?: string; order_index?: number }
): Promise<BookmarkFolder> {
  const { data, error } = await supabase
    .from('bookmark_folders')
    .update(updates)
    .eq('id', folderId)
    .select()
    .single();

  if (error) {
    handleSupabaseError('updateBookmarkFolder', error);
  }

  return data;
}

/**
 * ブックマークフォルダを削除
 * フォルダ内のブックマークは folder_id が NULL になる
 */
export async function deleteBookmarkFolder(folderId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmark_folders')
    .delete()
    .eq('id', folderId);

  if (error) {
    handleSupabaseError('deleteBookmarkFolder', error);
  }
}
