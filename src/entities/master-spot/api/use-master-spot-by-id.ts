/**
 * マスタースポットをIDで取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getMasterSpotById } from '@/shared/api/supabase/master-spots';

export function useMasterSpotById(masterSpotId: string | null | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.masterSpotsDetail(masterSpotId || ''),
    queryFn: () => {
      if (!masterSpotId) return null;
      return getMasterSpotById(masterSpotId);
    },
    enabled: !!masterSpotId,
  });
}
