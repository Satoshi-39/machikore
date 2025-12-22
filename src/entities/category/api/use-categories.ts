/**
 * カテゴリ取得フック
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getCategories, type Category } from '@/shared/api/supabase/categories';

/**
 * 全てのアクティブなカテゴリを取得するフック
 */
export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: QUERY_KEYS.categories(),
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60 * 24, // 1日キャッシュ（カテゴリはほぼ変わらない）
  });
}
