/**
 * スポットにいいねしたユーザー一覧を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getSpotLikers } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';

export function useSpotLikers(spotId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.spotLikers(spotId || ''),
    queryFn: () => getSpotLikers(spotId!),
    enabled: !!spotId,
  });
}
