/**
 * ブックマーク取得
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
 * cursor方式のページネーション対応
 */

import { supabase, handleSupabaseError } from '../client';
import { FEED_PAGE_SIZE } from '@/shared/config';
import type { BookmarkWithDetails, BookmarkMinimal, BookmarkedSpotItem, BookmarkedMapItem } from './types';

/**
 * ブックマークを削除
 */
export async function removeBookmark(bookmarkId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId);

  if (error) {
    handleSupabaseError('removeBookmark', error);
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
    handleSupabaseError('moveBookmarkToFolder', error);
  }
}

/**
 * ユーザーのブックマーク一覧を取得（フォルダでフィルタ可能、cursor方式ページネーション対応）
 * @param userId ユーザーID
 * @param folderId - undefined: 全件, null: 未分類のみ, string: 特定フォルダ
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 */
export async function getUserBookmarks(
  userId: string,
  folderId?: string | null,
  limit: number = FEED_PAGE_SIZE,
  cursor?: string
): Promise<BookmarkWithDetails[]> {
  let query = supabase
    .from('bookmarks')
    .select(`
      id,
      user_id,
      map_id,
      user_spot_id,
      folder_id,
      created_at,
      user_spots (
        id,
        user_id,
        description,
        likes_count,
        bookmarks_count,
        comments_count,
        google_short_address,
        map_id,
        created_at,
        master_spots (
          id,
          name,
          google_short_address,
          latitude,
          longitude
        ),
        users (
          id,
          username,
          display_name,
          avatar_url
        ),
        maps (
          language
        ),
        images (
          id,
          cloud_path,
          order_index
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
    .order('created_at', { ascending: false })
    .limit(limit);

  // フォルダでフィルタ
  if (folderId === null) {
    // 未分類（フォルダなし）
    query = query.is('folder_id', null);
  } else if (folderId) {
    // 特定のフォルダ
    query = query.eq('folder_id', folderId);
  }
  // folderId が undefined の場合は全件取得

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getUserBookmarks', error);
  }

  return (data || []).map((bookmark: any) => {
    // スポット画像を order_index でソートして最初の1枚を取得
    let thumbnailImage = null;
    if (bookmark.user_spots?.images) {
      const images = bookmark.user_spots.images;
      const sortedImages = [...images].sort((a: any, b: any) => a.order_index - b.order_index);
      const firstImage = sortedImages[0];
      if (firstImage) {
        thumbnailImage = {
          id: firstImage.id,
          cloud_path: firstImage.cloud_path,
        };
      }
    }

    return {
      id: bookmark.id,
      user_id: bookmark.user_id,
      map_id: bookmark.map_id,
      user_spot_id: bookmark.user_spot_id,
      folder_id: bookmark.folder_id,
      created_at: bookmark.created_at,
      spot: bookmark.user_spots
        ? {
            id: bookmark.user_spots.id,
            user_id: bookmark.user_spots.user_id,
            map_id: bookmark.user_spots.map_id,
            description: bookmark.user_spots.description,
            likes_count: bookmark.user_spots.likes_count,
            bookmarks_count: bookmark.user_spots.bookmarks_count ?? 0,
            comments_count: bookmark.user_spots.comments_count ?? 0,
            google_short_address: bookmark.user_spots.google_short_address,
            created_at: bookmark.user_spots.created_at,
            master_spot: bookmark.user_spots.master_spots ? {
              id: bookmark.user_spots.master_spots.id,
              name: bookmark.user_spots.master_spots.name,
              google_short_address: bookmark.user_spots.master_spots.google_short_address,
              latitude: bookmark.user_spots.master_spots.latitude,
              longitude: bookmark.user_spots.master_spots.longitude,
            } : null,
            user: bookmark.user_spots.users || null,
            thumbnail_image: thumbnailImage,
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
    };
  });
}

/**
 * ユーザーのブックマーク一覧を軽量取得（フォルダ集計用）
 * 集計ロジックはentities層で行う
 */
export async function getBookmarksMinimal(userId: string): Promise<BookmarkMinimal[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('folder_id, user_spot_id, map_id')
    .eq('user_id', userId);

  if (error) {
    handleSupabaseError('getBookmarksMinimal', error);
  }

  return data || [];
}

/**
 * ユーザーがブックマークしたスポット一覧を取得（cursor方式ページネーション対応）
 * @param userId ユーザーID
 * @param folderId - undefined: 全件, null: 未分類のみ, string: 特定フォルダ
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 */
export async function getBookmarkedSpots(
  userId: string,
  folderId?: string | null,
  limit: number = FEED_PAGE_SIZE,
  cursor?: string
): Promise<BookmarkedSpotItem[]> {
  let query = supabase
    .from('bookmarks')
    .select(`
      id,
      folder_id,
      created_at,
      user_spots (
        id,
        user_id,
        description,
        likes_count,
        bookmarks_count,
        comments_count,
        google_short_address,
        map_id,
        created_at,
        master_spots (
          id,
          name,
          google_short_address,
          latitude,
          longitude
        ),
        users (
          id,
          username,
          display_name,
          avatar_url
        ),
        images (
          id,
          cloud_path,
          order_index
        )
      )
    `)
    .eq('user_id', userId)
    .not('user_spot_id', 'is', null) // スポットブックマークのみ
    .order('created_at', { ascending: false })
    .limit(limit);

  // フォルダでフィルタ
  if (folderId === null) {
    query = query.is('folder_id', null);
  } else if (folderId) {
    query = query.eq('folder_id', folderId);
  }

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getBookmarkedSpots', error);
  }

  return (data || [])
    .filter((bookmark: any) => bookmark.user_spots) // user_spotsがnullでないもののみ
    .map((bookmark: any) => {
      // スポット画像を order_index でソートして最初の1枚を取得
      let thumbnailImage = null;
      if (bookmark.user_spots?.images) {
        const images = bookmark.user_spots.images;
        const sortedImages = [...images].sort((a: any, b: any) => a.order_index - b.order_index);
        const firstImage = sortedImages[0];
        if (firstImage) {
          thumbnailImage = {
            id: firstImage.id,
            cloud_path: firstImage.cloud_path,
          };
        }
      }

      return {
        bookmarkId: bookmark.id,
        bookmarkedAt: bookmark.created_at,
        folderId: bookmark.folder_id,
        spot: {
          id: bookmark.user_spots.id,
          user_id: bookmark.user_spots.user_id,
          map_id: bookmark.user_spots.map_id,
          description: bookmark.user_spots.description,
          likes_count: bookmark.user_spots.likes_count,
          bookmarks_count: bookmark.user_spots.bookmarks_count ?? 0,
          comments_count: bookmark.user_spots.comments_count ?? 0,
          google_short_address: bookmark.user_spots.google_short_address,
          created_at: bookmark.user_spots.created_at,
          master_spot: bookmark.user_spots.master_spots ? {
            id: bookmark.user_spots.master_spots.id,
            name: bookmark.user_spots.master_spots.name,
            google_short_address: bookmark.user_spots.master_spots.google_short_address,
            latitude: bookmark.user_spots.master_spots.latitude,
            longitude: bookmark.user_spots.master_spots.longitude,
          } : null,
          user: bookmark.user_spots.users || null,
          thumbnail_image: thumbnailImage,
        },
      };
    });
}

/**
 * ユーザーがブックマークしたマップ一覧を取得（cursor方式ページネーション対応）
 * @param userId ユーザーID
 * @param folderId - undefined: 全件, null: 未分類のみ, string: 特定フォルダ
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 */
export async function getBookmarkedMaps(
  userId: string,
  folderId?: string | null,
  limit: number = FEED_PAGE_SIZE,
  cursor?: string
): Promise<BookmarkedMapItem[]> {
  let query = supabase
    .from('bookmarks')
    .select(`
      id,
      folder_id,
      created_at,
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
    .not('map_id', 'is', null) // マップブックマークのみ
    .order('created_at', { ascending: false })
    .limit(limit);

  // フォルダでフィルタ
  if (folderId === null) {
    query = query.is('folder_id', null);
  } else if (folderId) {
    query = query.eq('folder_id', folderId);
  }

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getBookmarkedMaps', error);
  }

  return (data || [])
    .filter((bookmark: any) => bookmark.maps) // mapsがnullでないもののみ
    .map((bookmark: any) => ({
      bookmarkId: bookmark.id,
      bookmarkedAt: bookmark.created_at,
      folderId: bookmark.folder_id,
      map: {
        id: bookmark.maps.id,
        name: bookmark.maps.name,
        description: bookmark.maps.description,
        thumbnail_url: bookmark.maps.thumbnail_url,
        spots_count: bookmark.maps.spots_count,
        likes_count: bookmark.maps.likes_count,
        user: bookmark.maps.users || null,
      },
    }));
}
