/**
 * ブックマーク取得用hooks
 */

import { useQuery } from '@tanstack/react-query';
import {
  getUserBookmarks,
  checkSpotBookmarked,
  checkMapBookmarked,
  getSpotBookmarkInfo,
  getMapBookmarkInfo,
  type BookmarkWithDetails,
} from '@/shared/api/supabase/bookmarks';

/**
 * ユーザーのブックマーク一覧を取得
 * @param folderId - undefined: 全件, null: 未分類のみ, string: 特定フォルダ
 */
export function useBookmarks(
  userId: string | null | undefined,
  folderId?: string | null
) {
  return useQuery<BookmarkWithDetails[], Error>({
    queryKey: ['bookmarks', userId, folderId],
    queryFn: () => {
      if (!userId) return [];
      return getUserBookmarks(userId, folderId);
    },
    enabled: !!userId,
  });
}

/**
 * スポットがブックマークされているか確認
 */
export function useCheckSpotBookmarked(
  userId: string | null | undefined,
  spotId: string | null | undefined
) {
  return useQuery<boolean, Error>({
    queryKey: ['bookmark-status', 'spot', userId, spotId],
    queryFn: () => {
      if (!userId || !spotId) return false;
      return checkSpotBookmarked(userId, spotId);
    },
    enabled: !!userId && !!spotId,
  });
}

/**
 * マップがブックマークされているか確認
 */
export function useCheckMapBookmarked(
  userId: string | null | undefined,
  mapId: string | null | undefined
) {
  return useQuery<boolean, Error>({
    queryKey: ['bookmark-status', 'map', userId, mapId],
    queryFn: () => {
      if (!userId || !mapId) return false;
      return checkMapBookmarked(userId, mapId);
    },
    enabled: !!userId && !!mapId,
  });
}

/** ブックマーク情報の型（複数フォルダ対応） */
export type BookmarkInfo = { id: string; folder_id: string | null }[];

/**
 * スポットのブックマーク情報を取得（どのフォルダに入っているか含む、複数フォルダ対応）
 */
export function useSpotBookmarkInfo(
  userId: string | null | undefined,
  spotId: string | null | undefined
) {
  return useQuery<BookmarkInfo, Error>({
    queryKey: ['bookmark-info', 'spot', userId, spotId],
    queryFn: () => {
      if (!userId || !spotId) return [];
      return getSpotBookmarkInfo(userId, spotId);
    },
    enabled: !!userId && !!spotId,
  });
}

/**
 * マップのブックマーク情報を取得（どのフォルダに入っているか含む、複数フォルダ対応）
 */
export function useMapBookmarkInfo(
  userId: string | null | undefined,
  mapId: string | null | undefined
) {
  return useQuery<BookmarkInfo, Error>({
    queryKey: ['bookmark-info', 'map', userId, mapId],
    queryFn: () => {
      if (!userId || !mapId) return [];
      return getMapBookmarkInfo(userId, mapId);
    },
    enabled: !!userId && !!mapId,
  });
}

