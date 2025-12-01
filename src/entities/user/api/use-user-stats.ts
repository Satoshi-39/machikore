/**
 * ユーザー統計情報を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getVisitsByUserId } from '@/shared/api/sqlite';
import { getFollowCounts } from '@/shared/api/supabase/follows';
import type { UUID } from '@/shared/types';

interface UserStats {
  visitedMachiCount: number; // 訪問した街の数（重複なし）
  followingCount: number; // フォロー数
  followersCount: number; // フォロワー数
}

/**
 * ユーザーの統計情報を取得
 */
export function useUserStats(userId: UUID) {
  return useQuery<UserStats, Error>({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      // 訪問記録を取得して、ユニークな街の数を計算
      const visits = getVisitsByUserId(userId);
      const uniqueMachiIds = new Set(visits.map((v) => v.machi_id));
      const visitedMachiCount = uniqueMachiIds.size;

      // フォロー数・フォロワー数をSupabaseから取得
      const followCounts = await getFollowCounts(userId);

      return {
        visitedMachiCount,
        followingCount: followCounts.following,
        followersCount: followCounts.followers,
      };
    },
    enabled: !!userId,
  });
}
