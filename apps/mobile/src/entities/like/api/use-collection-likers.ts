/**
 * コレクションにいいねしたユーザー一覧を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getCollectionLikers } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';

export function useCollectionLikers(collectionId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.collectionLikers(collectionId || ''),
    queryFn: () => getCollectionLikers(collectionId!),
    enabled: !!collectionId,
  });
}
