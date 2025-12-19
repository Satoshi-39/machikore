/**
 * カテゴリ別マップ取得hooks
 */

import { useQuery } from '@tanstack/react-query';
import { getPopularMapsByCategory, getLatestMapsByCategory } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

/**
 * カテゴリ別人気マップを取得するhook
 * @param categoryId カテゴリID
 * @param currentUserId 現在のユーザーID（いいね状態を取得するため）
 */
export function useCategoryPopularMaps(
  categoryId: string,
  limit: number = 10,
  currentUserId?: string | null
) {
  return useQuery<MapWithUser[], Error>({
    queryKey: ['category-popular-maps', categoryId, limit, currentUserId],
    queryFn: () => getPopularMapsByCategory(categoryId, limit, currentUserId),
    enabled: categoryId.length > 0,
    staleTime: 5 * 60 * 1000, // 5分
  });
}

/**
 * カテゴリ別新着マップを取得するhook
 * @param categoryId カテゴリID
 * @param currentUserId 現在のユーザーID（いいね状態を取得するため）
 */
export function useCategoryLatestMaps(
  categoryId: string,
  limit: number = 10,
  currentUserId?: string | null
) {
  return useQuery<MapWithUser[], Error>({
    queryKey: ['category-latest-maps', categoryId, limit, currentUserId],
    queryFn: () => getLatestMapsByCategory(categoryId, limit, currentUserId),
    enabled: categoryId.length > 0,
    staleTime: 5 * 60 * 1000, // 5分
  });
}
