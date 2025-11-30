/**
 * ブックマーク取得用hooks
 */

import { useQuery } from '@tanstack/react-query';
import {
  getUserBookmarks,
  checkSpotBookmarked,
  checkMapBookmarked,
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
