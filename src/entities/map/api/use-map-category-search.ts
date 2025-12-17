/**
 * カテゴリIDでマップを検索するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { searchPublicMapsByCategoryId } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

/**
 * カテゴリIDで公開マップを検索（発見タブ用）
 */
export function useMapCategorySearch(categoryId: string) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'category-search', categoryId],
    queryFn: () => searchPublicMapsByCategoryId(categoryId),
    enabled: categoryId.length > 0,
  });
}
