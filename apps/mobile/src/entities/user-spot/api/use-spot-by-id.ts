/**
 * IDでスポットを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getSpotWithDetails } from '@/shared/api/supabase/user-spots';
import type { SpotWithDetails } from '@/shared/types';

/**
 * IDでスポットを取得（master_spots, user, map_label等と結合）
 */
export function useSpotById(spotId: string | null, currentUserId?: string | null) {
  return useQuery<SpotWithDetails | null, Error>({
    queryKey: QUERY_KEYS.spotsDetail(spotId || ''),
    queryFn: () => {
      if (!spotId) return null;
      return getSpotWithDetails(spotId, currentUserId);
    },
    enabled: !!spotId,
  });
}
