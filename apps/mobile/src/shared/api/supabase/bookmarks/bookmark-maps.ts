/**
 * マップブックマーク操作
 * bookmarks_countはトリガーで自動更新される
 */

import { supabase, handleSupabaseError } from '../client';
import { log } from '@/shared/config/logger';
import type { Bookmark } from './types';

/**
 * マップをブックマーク
 */
export async function bookmarkMap(
  userId: string,
  mapId: string,
  folderId?: string | null
): Promise<Bookmark> {
  // デバッグ: セッションのユーザーIDと渡されたユーザーIDを比較
  const { data: { session } } = await supabase.auth.getSession();
  const authUserId = session?.user?.id;
  if (authUserId !== userId) {
    log.warn('[Bookmark] User ID mismatch:', { authUserId, userId });
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      map_id: mapId,
      folder_id: folderId || null,
    })
    .select()
    .single();

  if (error) {
    handleSupabaseError('bookmarkMap', error);
  }

  return data;
}

/**
 * マップのブックマークを解除
 */
export async function unbookmarkMap(userId: string, mapId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('map_id', mapId);

  if (error) {
    handleSupabaseError('unbookmarkMap', error);
  }
}

/**
 * ユーザーがマップをブックマークしているか確認
 */
export async function checkMapBookmarked(
  userId: string,
  mapId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('map_id', mapId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkMapBookmarked', error);
  }

  return data !== null;
}

/**
 * マップがどのフォルダにブックマークされているか取得（複数フォルダ対応）
 * @returns ブックマーク情報の配列（各フォルダへのブックマーク）
 */
export async function getMapBookmarkInfo(
  userId: string,
  mapId: string
): Promise<{ id: string; folder_id: string | null }[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id, folder_id')
    .eq('user_id', userId)
    .eq('map_id', mapId);

  if (error) {
    handleSupabaseError('getMapBookmarkInfo', error);
  }

  return data || [];
}

/**
 * マップを特定フォルダから削除
 */
export async function unbookmarkMapFromFolder(
  userId: string,
  mapId: string,
  folderId: string | null
): Promise<void> {
  let query = supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('map_id', mapId);

  if (folderId === null) {
    query = query.is('folder_id', null);
  } else {
    query = query.eq('folder_id', folderId);
  }

  const { error } = await query;

  if (error) {
    handleSupabaseError('unbookmarkMapFromFolder', error);
  }
}

/**
 * マップのブックマークをトグル
 */
export async function toggleMapBookmark(
  userId: string,
  mapId: string,
  folderId?: string | null
): Promise<boolean> {
  const isBookmarked = await checkMapBookmarked(userId, mapId);

  if (isBookmarked) {
    await unbookmarkMap(userId, mapId);
    return false;
  } else {
    await bookmarkMap(userId, mapId, folderId);
    return true;
  }
}
