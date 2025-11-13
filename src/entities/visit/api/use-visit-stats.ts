/**
 * 訪問統計を取得するhook
 */

import { useMemo } from 'react';
import { useVisits } from './use-visits';
import { getRecentVisits, getTotalVisitedStationCount } from '@/shared/api/sqlite';
import type { VisitStats } from '../model/types';

/**
 * ユーザーの訪問統計を取得
 */
export function useVisitStats(userId: string) {
  const { data: visits, ...rest } = useVisits(userId);

  const stats = useMemo<VisitStats | null>(() => {
    if (!visits) return null;

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // 今月の訪問数
    const thisMonthVisits = visits.filter((visit) =>
      visit.visited_at.startsWith(thisMonth)
    ).length;

    // 総訪問回数
    const totalVisits = visits.reduce(
      (sum, visit) => sum + (visit.visit_count ?? 0),
      0
    );

    // 最近の訪問記録（最大5件）
    const recentVisits = getRecentVisits(userId, 5);

    return {
      totalStations: getTotalVisitedStationCount(userId),
      totalVisits,
      thisMonthVisits,
      recentVisits,
    };
  }, [visits, userId]);

  return {
    data: stats,
    ...rest,
  };
}
