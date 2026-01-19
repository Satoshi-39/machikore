/**
 * タグでマップを検索するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchPublicMaps, getTagByName, type MapSearchFilters } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

/**
 * タグで公開マップを検索（発見タブ用）
 * @param tag タグ名
 * @param filters フィルター条件
 */
export function useMapTagSearch(tag: string, filters?: MapSearchFilters) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'tag-search', tag, filters],
    queryFn: async () => {
      // タグ名からタグIDを取得
      const tagData = await getTagByName(tag);
      if (!tagData) return [];

      // tag_ids_filterにタグIDを追加してRPCで検索
      return searchPublicMaps('', {
        ...filters,
        tagIds: [tagData.id],
      });
    },
    enabled: tag.length > 0,
    staleTime: 0,
  });
}
