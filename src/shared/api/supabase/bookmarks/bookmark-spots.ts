/**
 * スポットブックマーク操作
 * bookmarks_countはトリガーで自動更新される
 */

import { supabase, handleSupabaseError } from '../client';
import type { Bookmark } from './types';

/**
 * スポットをブックマーク
 */
export async function bookmarkSpot(
  userId: string,
  spotId: string,
  folderId?: string | null
): Promise<Bookmark> {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      user_spot_id: spotId,
      folder_id: folderId || null,
    })
    .select()
    .single();

  if (error) {
    handleSupabaseError('bookmarkSpot', error);
  }

  return data;
}

/**
 * スポットのブックマークを解除
 */
export async function unbookmarkSpot(userId: string, spotId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('user_spot_id', spotId);

  if (error) {
    handleSupabaseError('unbookmarkSpot', error);
  }
}

/**
 * ユーザーがスポットをブックマークしているか確認
 */
export async function checkSpotBookmarked(
  userId: string,
  spotId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('user_spot_id', spotId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkSpotBookmarked', error);
  }

  return data !== null;
}

/**
 * スポットがどのフォルダにブックマークされているか取得（複数フォルダ対応）
 * @returns ブックマーク情報の配列（各フォルダへのブックマーク）
 */
export async function getSpotBookmarkInfo(
  userId: string,
  spotId: string
): Promise<{ id: string; folder_id: string | null }[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id, folder_id')
    .eq('user_id', userId)
    .eq('user_spot_id', spotId);

  if (error) {
    handleSupabaseError('getSpotBookmarkInfo', error);
  }

  return data || [];
}

/**
 * スポットを特定フォルダから削除
 */
export async function unbookmarkSpotFromFolder(
  userId: string,
  spotId: string,
  folderId: string | null
): Promise<void> {
  let query = supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('user_spot_id', spotId);

  if (folderId === null) {
    query = query.is('folder_id', null);
  } else {
    query = query.eq('folder_id', folderId);
  }

  const { error } = await query;

  if (error) {
    handleSupabaseError('unbookmarkSpotFromFolder', error);
  }
}

/**
 * スポットのブックマークをトグル
 */
export async function toggleSpotBookmark(
  userId: string,
  spotId: string,
  folderId?: string | null
): Promise<boolean> {
  const isBookmarked = await checkSpotBookmarked(userId, spotId);

  if (isBookmarked) {
    await unbookmarkSpot(userId, spotId);
    return false;
  } else {
    await bookmarkSpot(userId, spotId, folderId);
    return true;
  }
}
