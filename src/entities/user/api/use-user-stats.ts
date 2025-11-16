/**
 * ユーザー統計情報を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import {
  getVisitsByUserId,
} from '@/shared/api/sqlite';
import type { UUID } from '@/shared/types';

interface UserStats {
  visitedMachiCount: number; // 訪問した街の数（重複なし）
  spotsCount: number; // スポット数（全マップの合計）
  friendsCount: number; // 友達の数
}

/**
 * ユーザーの統計情報を取得
 */
export function useUserStats(userId: UUID) {
  return useQuery<UserStats, Error>({
    queryKey: ['userStats', userId],
    queryFn: () => {
      // スポット数（将来実装: 全マップのスポット数を合計）
      const spotsCount = 0; // TODO: Implement getTotalSpotsByUser

      // 訪問記録を取得して、ユニークな街の数を計算
      const visits = getVisitsByUserId(userId);
      const uniqueMachiIds = new Set(visits.map((v) => v.machi_id));
      const visitedMachiCount = uniqueMachiIds.size;

      // 友達の数（将来実装予定）
      const friendsCount = 0;

      return {
        visitedMachiCount,
        spotsCount,
        friendsCount,
      };
    },
    enabled: !!userId,
  });
}
