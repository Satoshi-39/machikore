/**
 * IDでスポットを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getSpotById, type UserSpotWithMasterSpot } from '@/shared/api/supabase/user-spots';

/**
 * IDでスポットを取得（master_spotsと結合）
 */
export function useSpotById(spotId: string | null) {
  return useQuery<UserSpotWithMasterSpot | null, Error>({
    queryKey: QUERY_KEYS.spotsDetail(spotId || ''),
    queryFn: () => {
      if (!spotId) return null;
      return getSpotById(spotId);
    },
    enabled: !!spotId,
  });
}
