/**
 * 訪問に紐づく投稿を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPostsByVisitId } from '@/shared/api/sqlite';
import type { UUID } from '@/shared/types';
import type { PostRow } from '@/shared/types/database.types';

/**
 * 訪問IDで投稿を取得
 */
export function usePostsByVisit(visitId: UUID) {
  return useQuery<PostRow[], Error>({
    queryKey: [...QUERY_KEYS.posts, 'byVisit', visitId],
    queryFn: () => getPostsByVisitId(visitId),
    enabled: !!visitId,
  });
}
