/**
 * タグでマップを検索するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchPublicMaps, getTagByName, type MapSearchFilters } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';
import { log } from '@/shared/config/logger';

/**
 * タグで公開マップを検索（発見タブ用）
 * @param tag タグ名
 * @param filters フィルター条件
 */
export function useMapTagSearch(tag: string, filters?: MapSearchFilters) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsTagSearch(tag), filters],
    queryFn: async () => {
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
      });
      log.debug('[useMapTagSearch] Search results count:', results.length);

      return results;
    },
    enabled: tag.length > 0,
    staleTime: 0,
  });
}
