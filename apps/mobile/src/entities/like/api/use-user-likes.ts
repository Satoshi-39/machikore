/**
 * ユーザーのいいね一覧を取得するhooks
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getUserLikedSpots, getUserLikedMaps } from '@/shared/api/supabase/likes';

/**
 * ユーザーがいいねしたスポット一覧を取得
 */
export function useUserLikedSpots(userId: string | null | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.userLikedSpots(userId || ''),
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
    queryKey: QUERY_KEYS.userLikedMaps(userId || ''),
    queryFn: () => {
      if (!userId) return [];
      return getUserLikedMaps(userId);
    },
    enabled: !!userId,
  });
}
