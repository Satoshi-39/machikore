/**
 * IDでスポットを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getSpotById, type UserSpotWithMasterSpot } from '@/shared/api/supabase/spots';

/**
 * IDでスポットを取得（master_spotsと結合）
 */
export function useSpotById(spotId: string | null) {
  return useQuery<UserSpotWithMasterSpot | null, Error>({
    queryKey: ['spot', spotId],
    queryFn: () => {
      if (!spotId) return null;
      return getSpotById(spotId);
    },
    enabled: !!spotId,
  });
}
