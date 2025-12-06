/**
 * マップにいいねしたユーザー一覧を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getMapLikers } from '@/shared/api/supabase/likes';

export function useMapLikers(mapId: string | null) {
  return useQuery({
    queryKey: ['mapLikers', mapId],
    queryFn: () => getMapLikers(mapId!),
    enabled: !!mapId,
  });
}
