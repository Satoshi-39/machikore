/**
 * タグでマップを検索するhook
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchPublicMaps, getTagByName, type MapSearchFilters } from '@/shared/api/supabase';
import { SEARCH_PAGE_SIZE } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';
import { log } from '@/shared/config/logger';

/**
 * タグで公開マップを検索（発見タブ用、無限スクロール対応）
 * @param tag タグ名
 * @param filters フィルター条件
 */
export function useMapTagSearch(tag: string, filters?: MapSearchFilters, currentUserId?: string | null) {
  return useInfiniteQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsTagSearch(tag), filters, currentUserId],
    queryFn: async ({ pageParam }) => {
      log.debug('[useMapTagSearch] Searching for tag:', tag);

      // タグ名からタグIDを取得
      const tagData = await getTagByName(tag);
      log.debug('[useMapTagSearch] Tag data:', tagData);

      if (!tagData) {
        log.warn('[useMapTagSearch] Tag not found:', tag);
        return [];
      }

      // tag_ids_filterにタグIDを追加してRPCで検索
      const results = await searchPublicMaps('', {
        ...filters,
        tagIds: [tagData.id],
      }, SEARCH_PAGE_SIZE, currentUserId, pageParam as number);
      log.debug('[useMapTagSearch] Search results count:', results.length);

      return results;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < SEARCH_PAGE_SIZE) return undefined;
      return (lastPageParam as number) + SEARCH_PAGE_SIZE;
    },
    enabled: tag.length > 0,
    staleTime: 0,
  });
}
