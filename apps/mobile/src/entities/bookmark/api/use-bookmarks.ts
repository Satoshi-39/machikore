/**
 * ブックマーク取得用hooks
 * cursor方式の無限スクロール対応
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { FEED_PAGE_SIZE, MAX_PAGES } from '@/shared/config';
import {
  getBookmarkedSpots,
  getBookmarkedMaps,
  checkSpotBookmarked,
  checkMapBookmarked,
  getSpotBookmarkInfo,
  getMapBookmarkInfo,
  getBookmarksMinimal,
  type BookmarkedSpotItem,
  type BookmarkedMapItem,
} from '@/shared/api/supabase/bookmarks';
import type { BookmarkInfo } from '../model/types';

/**
 * ユーザーがブックマークしたスポット一覧を取得（無限スクロール対応）
 * @param folderId - undefined: 全件, null: 未分類のみ, string: 特定フォルダ
 */
export function useBookmarkedSpots(
  userId: string | null | undefined,
  folderId?: string | null
) {
  return useInfiniteQuery<BookmarkedSpotItem[], Error>({
    queryKey: QUERY_KEYS.bookmarkedSpots(userId || '', folderId ?? undefined),
    queryFn: async ({ pageParam }) => {
      if (!userId) return [];
      return getBookmarkedSpots(userId, folderId, FEED_PAGE_SIZE, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.bookmarkedAt;
    },
    maxPages: MAX_PAGES.FEED,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * ユーザーがブックマークしたマップ一覧を取得（無限スクロール対応）
 * @param folderId - undefined: 全件, null: 未分類のみ, string: 特定フォルダ
 */
export function useBookmarkedMaps(
  userId: string | null | undefined,
  folderId?: string | null
) {
  return useInfiniteQuery<BookmarkedMapItem[], Error>({
    queryKey: QUERY_KEYS.bookmarkedMaps(userId || '', folderId ?? undefined),
    queryFn: async ({ pageParam }) => {
      if (!userId) return [];
      return getBookmarkedMaps(userId, folderId, FEED_PAGE_SIZE, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.bookmarkedAt;
    },
    maxPages: MAX_PAGES.FEED,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
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

/**
 * フォルダごとのブックマーク数
 * キー: folder_id（未分類は'uncategorized'）
 */
export type FolderBookmarkCounts = Record<string, { spots: number; maps: number }>;

/**
 * フォルダごとのブックマーク数を取得
 * 集計ロジックはentities層で実行（FSD準拠）
 */
export function useFolderBookmarkCounts(userId: string | null | undefined) {
  return useQuery<FolderBookmarkCounts, Error>({
    queryKey: QUERY_KEYS.folderBookmarkCounts(userId || ''),
    queryFn: async () => {
      if (!userId) return {};

      // shared/api層から生データを取得
      const bookmarks = await getBookmarksMinimal(userId);

      // entities層で集計
      const counts: FolderBookmarkCounts = {};
      bookmarks.forEach((bookmark) => {
        const folderId = bookmark.folder_id || 'uncategorized';
        if (!counts[folderId]) {
          counts[folderId] = { spots: 0, maps: 0 };
        }
        if (bookmark.user_spot_id) {
          counts[folderId].spots++;
        }
        if (bookmark.map_id) {
          counts[folderId].maps++;
        }
      });

      return counts;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

