/**
 * 最近訪問した街を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getVisitsByUserId } from '@/shared/api/supabase/visits';
import { getMachiById } from '@/shared/api/sqlite';
import type { UUID } from '@/shared/types';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * 最近訪問した街を取得（街情報を含む）
 */
export function useRecentVisits(userId: UUID | null | undefined, limit: number = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.visitsList(userId || ''), 'recent', limit],
    queryFn: async () => {
      if (!userId) return [];

      const visits = await getVisitsByUserId(userId);

      // 最新順にソートして制限（Supabaseは既にソート済みだが念のため）
      const recentVisits = visits.slice(0, limit);

      // 各訪問記録に街情報を追加（SQLiteのローカルマスターデータを使用）
      return recentVisits.map((visit) => {
        const machi = getMachiById(visit.machi_id);
        return {
          ...visit,
          machi: machi as MachiRow,
        };
      }).filter((v) => v.machi); // machiが存在するもののみ
    },
    enabled: !!userId,
  });
}
