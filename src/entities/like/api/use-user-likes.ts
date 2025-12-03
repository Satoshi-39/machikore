/**
 * ユーザーのいいね一覧を取得するhooks
 */

import { useQuery } from '@tanstack/react-query';
import { getUserLikedSpots, getUserLikedMaps, getUserLikedMasterSpots } from '@/shared/api/supabase/likes';

/**
 * ユーザーがいいねしたスポット一覧を取得
 */
export function useUserLikedSpots(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['user-liked-spots', userId],
    queryFn: () => {
      if (!userId) return [];
      return getUserLikedSpots(userId);
    },
    enabled: !!userId,
  });
}

/**
 * ユーザーがいいねしたマップ一覧を取得
 */
export function useUserLikedMaps(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['user-liked-maps', userId],
    queryFn: () => {
      if (!userId) return [];
      return getUserLikedMaps(userId);
    },
    enabled: !!userId,
  });
}

/**
 * ユーザーがいいねしたマスタースポット一覧を取得
 */
export function useUserLikedMasterSpots(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['user-liked-master-spots', userId],
    queryFn: () => {
      if (!userId) return [];
      return getUserLikedMasterSpots(userId);
    },
    enabled: !!userId,
  });
}
