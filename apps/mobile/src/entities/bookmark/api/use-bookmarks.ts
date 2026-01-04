/**
 * ブックマーク取得用hooks
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  getUserBookmarks,
  checkSpotBookmarked,
  checkMapBookmarked,
  getSpotBookmarkInfo,
  getMapBookmarkInfo,
  type BookmarkWithDetails,
} from '@/shared/api/supabase/bookmarks';
import type { BookmarkInfo } from '../model/types';

/**
 * ユーザーのブックマーク一覧を取得
 * @param folderId - undefined: 全件, null: 未分類のみ, string: 特定フォルダ
 */
export function useBookmarks(
  userId: string | null | undefined,
  folderId?: string | null
) {
  return useQuery<BookmarkWithDetails[], Error>({
    queryKey: QUERY_KEYS.bookmarksList(userId || '', folderId ?? undefined),
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
    queryKey: QUERY_KEYS.bookmarkStatus('spot', userId || '', spotId || ''),
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
    queryKey: QUERY_KEYS.bookmarkStatus('map', userId || '', mapId || ''),
    queryFn: () => {
      if (!userId || !mapId) return false;
      return checkMapBookmarked(userId, mapId);
    },
    enabled: !!userId && !!mapId,
  });
}

/**
 * スポットのブックマーク情報を取得（どのフォルダに入っているか含む、複数フォルダ対応）
 */
export function useSpotBookmarkInfo(
  userId: string | null | undefined,
  spotId: string | null | undefined
) {
  return useQuery<BookmarkInfo, Error>({
    queryKey: QUERY_KEYS.bookmarkInfo('spot', userId || '', spotId || ''),
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
    queryKey: QUERY_KEYS.bookmarkInfo('map', userId || '', mapId || ''),
    queryFn: () => {
      if (!userId || !mapId) return [];
      return getMapBookmarkInfo(userId, mapId);
    },
    enabled: !!userId && !!mapId,
  });
}

