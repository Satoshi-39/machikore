/**
 * スポットにいいねしたユーザー一覧を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getSpotLikers } from '@/shared/api/supabase/likes';

export function useSpotLikers(spotId: string | null) {
  return useQuery({
    queryKey: ['spotLikers', spotId],
    queryFn: () => getSpotLikers(spotId!),
    enabled: !!spotId,
  });
}
