/**
 * マスタースポットをIDで取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getMasterSpotById } from '@/shared/api/supabase/spots';

export function useMasterSpotById(masterSpotId: string | null | undefined) {
  return useQuery({
    queryKey: ['master-spot', masterSpotId],
    queryFn: () => {
      if (!masterSpotId) return null;
      return getMasterSpotById(masterSpotId);
    },
    enabled: !!masterSpotId,
  });
}
