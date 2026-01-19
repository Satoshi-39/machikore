/**
 * タグでマップを検索するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchPublicMapsByTag } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

/**
 * タグで公開マップを検索（発見タブ用）
 */
export function useMapTagSearch(tag: string) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'tag-search', tag],
    queryFn: () => searchPublicMapsByTag(tag),
    enabled: tag.length > 0,
    staleTime: 0,
  });
}
