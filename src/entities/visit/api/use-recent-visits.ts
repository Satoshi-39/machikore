/**
 * 最近訪問した街を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getVisitsByUserId, getMachiById } from '@/shared/api/sqlite';
import type { UUID } from '@/shared/types';
import type { VisitRow, MachiRow } from '@/shared/types/database.types';

/**
 * 最近訪問した街を取得（街情報を含む）
 */
export function useRecentVisits(userId: UUID, limit: number = 10) {
  return useQuery<(VisitRow & { machi: MachiRow })[], Error>({
    queryKey: [...QUERY_KEYS.visitsList(userId), 'recent', limit],
    queryFn: () => {
      const visits = getVisitsByUserId(userId);

      // 最新順にソートして制限
      const recentVisits = visits
        .sort(
          (a, b) =>
            new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime()
        )
        .slice(0, limit);

      // 各訪問記録に街情報を追加
      return recentVisits.map((visit) => {
        const machi = getMachiById(visit.machi_id);
        return {
          ...visit,
          machi: machi!,
        };
      }).filter((v) => v.machi); // machiが存在するもののみ
    },
    enabled: !!userId,
  });
}
