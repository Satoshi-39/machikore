/**
 * カテゴリ別おすすめマップ取得用hooks
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';
import type { MapWithUser } from '@/shared/types';

/**
 * カテゴリ別おすすめマップを取得
 * @param categoryId カテゴリID
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
async function getCategoryFeaturedMaps(
  categoryId: string,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('category_featured_maps')
    .select(`
      id,
      display_order,
      map:maps (
        *,
        user:users!maps_user_id_fkey(id, username, display_name, avatar_url),
        likes(id, user_id),
        bookmarks(id, user_id)
      )
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    log.error('[CategoryFeaturedMaps] Error:', error);
    throw error;
  }

  // マップデータを整形
  return (data ?? [])
    .filter((item: any) => item.map !== null)
    .map((item: any) => {
      const map = item.map;
      return {
        id: map.id,
        user_id: map.user_id,
        name: map.name,
        description: map.description,
        category: map.category,
        category_id: map.category_id,
        is_public: map.is_public,
        is_default: map.is_default,
        is_official: map.is_official,
        thumbnail_url: map.thumbnail_url,
        spots_count: map.spots_count,
        likes_count: map.likes_count,
        bookmarks_count: map.bookmarks_count ?? 0,
        comments_count: map.comments_count ?? 0,
        created_at: map.created_at,
        updated_at: map.updated_at,
        user: map.user || null,
        is_article_public: map.is_article_public ?? false,
        article_intro: map.article_intro ?? null,
        article_outro: map.article_outro ?? null,
        show_label_chips: map.show_label_chips ?? false,
        is_liked: currentUserId
          ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
          : false,
        is_bookmarked: currentUserId
          ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
          : false,
      };
    });
}

/**
 * カテゴリ別おすすめマップを取得するhook
 * @param categoryId カテゴリID
 * @param currentUserId 現在のユーザーID
 */
export function useCategoryFeaturedMaps(
  categoryId: string,
  currentUserId?: string | null
) {
  return useQuery<MapWithUser[], Error>({
    queryKey: ['category-featured-maps', categoryId, currentUserId],
    queryFn: () => getCategoryFeaturedMaps(categoryId, currentUserId),
    enabled: categoryId.length > 0 && categoryId !== 'all',
    staleTime: 5 * 60 * 1000, // 5分
  });
}
