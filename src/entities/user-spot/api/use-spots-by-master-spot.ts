/**
 * master_spot_idに紐づくユーザー投稿を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getUserSpotsByMasterSpotId } from '@/shared/api/supabase/user-spots';
import { QUERY_KEYS } from '@/shared/api/query-client';

export function useSpotsByMasterSpot(masterSpotId: string | null, limit: number = 20) {
  return useQuery({
    queryKey: QUERY_KEYS.spotsByMasterSpot(masterSpotId || '', limit),
    queryFn: () => {
      if (!masterSpotId) return [];
      return getUserSpotsByMasterSpotId(masterSpotId, limit);
    },
    enabled: !!masterSpotId,
  });
}
