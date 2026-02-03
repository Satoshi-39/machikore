/**
 * ユーザーのいいね一覧を取得するhooks
 * cursor方式の無限スクロール対応
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getUserLikedSpots, getUserLikedMaps } from '@/shared/api/supabase/likes';
import { FEED_PAGE_SIZE } from '@/shared/config';
import type { ThumbnailCrop } from '@/shared/lib/image';

/** いいねしたスポットの型 */
export interface LikedSpotItem {
  likeId: string;
  likedAt: string;
  spot: {
    id: string;
    user_id: string;
    map_id: string;
    master_spot_id: string | null;
    machi_id: string;
    description: string; // NOT NULL in DB
    spot_color: string | null;
    images_count: number;
    likes_count: number;
    bookmarks_count: number;
    comments_count: number;
    order_index: number;
    created_at: string;
    updated_at: string;
    latitude: number | null;
    longitude: number | null;
    google_formatted_address: any;
    google_short_address: any;
    master_spot: {
      id: string;
      name: any;
      latitude: number | null;
      longitude: number | null;
      google_place_id: string | null;
      google_formatted_address: any;
      google_short_address: any;
      google_types: string[] | null;
    } | null;
    user: {
      id: string;
      username: string;
      display_name: string;
      avatar_url: string | null;
      avatar_crop: ThumbnailCrop | null;
    } | null;
    is_liked: boolean;
    thumbnail_image: {
      id: string;
      cloud_path: string;
    } | null;
  };
}

/** いいねしたマップの型 */
export interface LikedMapItem {
  likeId: string;
  likedAt: string;
  map: {
    id: string;
    name: string;
    description: string | null;
    is_public: boolean;
    likes_count: number;
    spots_count: number;
    created_at: string;
    user: {
      id: string;
      username: string;
      display_name: string;
      avatar_url: string | null;
    } | null;
  };
}

/**
 * ユーザーがいいねしたスポット一覧を取得（無限スクロール対応）
 */
export function useUserLikedSpots(userId: string | null | undefined) {
  return useInfiniteQuery<LikedSpotItem[], Error>({
    queryKey: QUERY_KEYS.userLikedSpots(userId || ''),
    queryFn: async ({ pageParam }) => {
      if (!userId) return [];
      return getUserLikedSpots(userId, FEED_PAGE_SIZE, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 取得した件数がFEED_PAGE_SIZE未満なら次のページはない
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      // 最後のアイテムのlikedAtをcursorとして返す
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.likedAt;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

/**
 * ユーザーがいいねしたマップ一覧を取得（無限スクロール対応）
 */
export function useUserLikedMaps(userId: string | null | undefined) {
  return useInfiniteQuery<LikedMapItem[], Error>({
    queryKey: QUERY_KEYS.userLikedMaps(userId || ''),
    queryFn: async ({ pageParam }) => {
      if (!userId) return [];
      return getUserLikedMaps(userId, FEED_PAGE_SIZE, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 取得した件数がFEED_PAGE_SIZE未満なら次のページはない
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      // 最後のアイテムのlikedAtをcursorとして返す
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.likedAt;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
