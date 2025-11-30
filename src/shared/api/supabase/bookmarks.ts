/**
 * Supabase Bookmarks API
 * ブックマーク・フォルダ機能
 */

import { supabase } from './client';

// ===============================
// 型定義
// ===============================

export type BookmarkFolderType = 'spots' | 'maps';

export interface BookmarkFolder {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  order_index: number;
  folder_type: BookmarkFolderType;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  map_id: string | null;
  spot_id: string | null;
  folder_id: string | null;
  created_at: string;
}

export interface BookmarkWithDetails extends Bookmark {
  spot?: {
    id: string;
    custom_name: string | null;
    description: string | null;
    likes_count: number;
    master_spot: {
      id: string;
      name: string;
      google_formatted_address: string | null;
    } | null;
    user: {
      id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  } | null;
  map?: {
    id: string;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    spots_count: number;
    likes_count: number;
    user: {
      id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  } | null;
}

// ===============================
// フォルダ操作
// ===============================

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
    console.error('[getBookmarkFolders] Error:', error);
    throw error;
  }

  return data || [];
}

/**
 * ブックマークフォルダを作成
 */
export async function createBookmarkFolder(
  userId: string,
  name: string,
  folderType: BookmarkFolderType,
  color?: string
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
      color: color || null,
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) {
    console.error('[createBookmarkFolder] Error:', error);
    throw error;
  }

  return data;
}

/**
 * ブックマークフォルダを更新
 */
export async function updateBookmarkFolder(
  folderId: string,
  updates: { name?: string; color?: string | null; order_index?: number }
): Promise<BookmarkFolder> {
  const { data, error } = await supabase
    .from('bookmark_folders')
    .update(updates)
    .eq('id', folderId)
    .select()
    .single();

  if (error) {
    console.error('[updateBookmarkFolder] Error:', error);
    throw error;
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
    console.error('[deleteBookmarkFolder] Error:', error);
    throw error;
  }
}

// ===============================
// ブックマーク操作
// ===============================

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
      spot_id: spotId,
      folder_id: folderId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[bookmarkSpot] Error:', error);
    throw error;
  }

  return data;
}

/**
 * マップをブックマーク
 */
export async function bookmarkMap(
  userId: string,
  mapId: string,
  folderId?: string | null
): Promise<Bookmark> {
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
    console.error('[bookmarkMap] Error:', error);
    throw error;
  }

  return data;
}

/**
 * ブックマークを削除
 */
export async function removeBookmark(bookmarkId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId);

  if (error) {
    console.error('[removeBookmark] Error:', error);
    throw error;
  }
}

/**
 * スポットのブックマークを解除
 */
export async function unbookmarkSpot(userId: string, spotId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('spot_id', spotId);

  if (error) {
    console.error('[unbookmarkSpot] Error:', error);
    throw error;
  }
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
    console.error('[unbookmarkMap] Error:', error);
    throw error;
  }
}

/**
 * ブックマークのフォルダを変更
 */
export async function moveBookmarkToFolder(
  bookmarkId: string,
  folderId: string | null
): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .update({ folder_id: folderId })
    .eq('id', bookmarkId);

  if (error) {
    console.error('[moveBookmarkToFolder] Error:', error);
    throw error;
  }
}

// ===============================
// ブックマーク取得
// ===============================

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
    .eq('spot_id', spotId)
    .maybeSingle();

  if (error) {
    console.error('[checkSpotBookmarked] Error:', error);
    throw error;
  }

  return data !== null;
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
    console.error('[checkMapBookmarked] Error:', error);
    throw error;
  }

  return data !== null;
}

/**
 * ユーザーのブックマーク一覧を取得（フォルダでフィルタ可能）
 */
export async function getUserBookmarks(
  userId: string,
  folderId?: string | null
): Promise<BookmarkWithDetails[]> {
  let query = supabase
    .from('bookmarks')
    .select(`
      id,
      user_id,
      map_id,
      spot_id,
      folder_id,
      created_at,
      user_spots (
        id,
        custom_name,
        description,
        likes_count,
        master_spots (
          id,
          name,
          google_formatted_address
        ),
        users (
          id,
          username,
          display_name,
          avatar_url
        )
      ),
      maps (
        id,
        name,
        description,
        thumbnail_url,
        spots_count,
        likes_count,
        users (
          id,
          username,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // フォルダでフィルタ
  if (folderId === null) {
    // 未分類（フォルダなし）
    query = query.is('folder_id', null);
  } else if (folderId) {
    // 特定のフォルダ
    query = query.eq('folder_id', folderId);
  }
  // folderId が undefined の場合は全件取得

  const { data, error } = await query;

  if (error) {
    console.error('[getUserBookmarks] Error:', error);
    throw error;
  }

  return (data || []).map((bookmark: any) => ({
    id: bookmark.id,
    user_id: bookmark.user_id,
    map_id: bookmark.map_id,
    spot_id: bookmark.spot_id,
    folder_id: bookmark.folder_id,
    created_at: bookmark.created_at,
    spot: bookmark.user_spots
      ? {
          id: bookmark.user_spots.id,
          custom_name: bookmark.user_spots.custom_name,
          description: bookmark.user_spots.description,
          likes_count: bookmark.user_spots.likes_count,
          master_spot: bookmark.user_spots.master_spots || null,
          user: bookmark.user_spots.users || null,
        }
      : null,
    map: bookmark.maps
      ? {
          id: bookmark.maps.id,
          name: bookmark.maps.name,
          description: bookmark.maps.description,
          thumbnail_url: bookmark.maps.thumbnail_url,
          spots_count: bookmark.maps.spots_count,
          likes_count: bookmark.maps.likes_count,
          user: bookmark.maps.users || null,
        }
      : null,
  }));
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
