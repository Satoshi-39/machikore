/**
 * マップにいいねしたユーザー一覧を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getMapLikers } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';

export function useMapLikers(mapId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.mapLikers(mapId || ''),
    queryFn: () => getMapLikers(mapId!),
    enabled: !!mapId,
  });
}
