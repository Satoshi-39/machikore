/**
 * master_spot_idに紐づくユーザー投稿を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getUserSpotsByMasterSpotId } from '@/shared/api/supabase/user-spots';

export function useSpotsByMasterSpot(masterSpotId: string | null, limit: number = 20) {
  return useQuery({
    queryKey: ['user-spots', 'master-spot', masterSpotId, limit],
    queryFn: () => {
      if (!masterSpotId) return [];
      return getUserSpotsByMasterSpotId(masterSpotId, limit);
    },
    enabled: !!masterSpotId,
  });
}
