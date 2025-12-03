/**
 * 訪問統計を取得するhook
 */

import { useMemo } from 'react';
import { useVisits } from './use-visits';
import type { VisitStats } from '../model/types';

/**
 * ユーザーの訪問統計を取得
 */
export function useVisitStats(userId: string | null | undefined) {
  const { data: visits, ...rest } = useVisits(userId);

  const stats = useMemo<VisitStats | null>(() => {
    if (!visits || !Array.isArray(visits)) return null;

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // 今月の訪問数
    const thisMonthVisits = visits.filter((visit) =>
      visit.visited_at.startsWith(thisMonth)
    ).length;

    // 最近の訪問記録（最大5件）
    const recentVisits = visits.slice(0, 5);

    return {
      totalStations: visits.length,
      thisMonthVisits,
      recentVisits,
    };
  }, [visits]);

  return {
    data: stats,
    ...rest,
  };
}
