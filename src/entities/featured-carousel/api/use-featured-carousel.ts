/**
 * 特集カルーセル取得用hooks
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';
import type { Database } from '@/shared/types/database.types';

/**
 * リンク種別
 */
export type FeaturedCarouselLinkType = 'tag' | 'map' | 'url';

/**
 * 特集カルーセルアイテムの型（Database型から取得）
 */
export type FeaturedCarouselItem = Database['public']['Tables']['featured_carousel_items']['Row'];

/**
 * 有効な特集カルーセルアイテムを取得
 * RLSで is_active=true, 期間内のもののみ返される
 * @param categoryId カテゴリID（'all'または未指定の場合はcategory_id=nullのアイテムを取得）
 */
async function getFeaturedCarouselItems(categoryId?: string): Promise<FeaturedCarouselItem[]> {
  let query = supabase
    .from('featured_carousel_items')
    .select('*')
    .order('display_order', { ascending: true });

  // カテゴリでフィルター
  if (!categoryId || categoryId === 'all') {
    // 「すべて」の場合はcategory_id=nullのアイテムを取得
    query = query.is('category_id', null);
  } else {
    // 特定カテゴリの場合はそのカテゴリのアイテムを取得
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    log.error('[FeaturedCarousel] Error:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * 特集カルーセルアイテム一覧を取得するhook
 * @param categoryId カテゴリID（'all'または未指定の場合は「すべて」用を取得）
 */
export function useFeaturedCarouselItems(categoryId?: string) {
  return useQuery<FeaturedCarouselItem[], Error>({
    queryKey: ['featured-carousel-items', categoryId ?? 'all'],
    queryFn: () => getFeaturedCarouselItems(categoryId),
    // 5分ごとに更新
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 特集カルーセルアイテムを単体で取得
 */
async function getFeaturedCarouselItem(id: string): Promise<FeaturedCarouselItem | null> {
  const { data, error } = await supabase
    .from('featured_carousel_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    log.error('[FeaturedCarousel] Error:', error);
    throw error;
  }

  return data;
}

/**
 * 特集カルーセルアイテムを単体で取得するhook
 */
export function useFeaturedCarouselItem(id: string | undefined) {
  return useQuery<FeaturedCarouselItem | null, Error>({
    queryKey: ['featured-carousel-item', id],
    queryFn: () => getFeaturedCarouselItem(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
