/**
 * 街に属するマスタースポットを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getMasterSpotsByMachi, type MasterSpotDisplay } from '@/shared/api/supabase/master-spots';

/**
 * 指定された街IDに属するマスタースポットを取得（いいね数順）
 */
export function useMasterSpotsByMachi(machiId: string, limit: number = 20) {
  return useQuery<MasterSpotDisplay[], Error>({
    queryKey: ['masterSpots', 'byMachi', machiId, limit],
    queryFn: () => getMasterSpotsByMachi(machiId, limit),
    enabled: !!machiId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
