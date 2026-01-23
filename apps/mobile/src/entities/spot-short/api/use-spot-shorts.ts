/**
 * スポットショート取得hook
 */

import { useQuery } from '@tanstack/react-query';
import { getSpotShorts } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';

/**
 * スポットIDでショート一覧を取得
 */
export function useSpotShorts(spotId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.spotsShorts(spotId ?? ''),
    queryFn: () => getSpotShorts(spotId!),
    enabled: !!spotId,
  });
}
