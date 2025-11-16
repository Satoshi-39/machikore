/**
 * IDでスポットを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getSpotById } from '@/shared/api/sqlite';
import type { SpotRow } from '@/shared/types/database.types';

/**
 * IDでスポットを取得
 */
export function useSpotById(spotId: string) {
  return useQuery<SpotRow | null, Error>({
    queryKey: QUERY_KEYS.spotsDetail(spotId),
    queryFn: () => {
      return getSpotById(spotId);
    },
    enabled: !!spotId,
  });
}
