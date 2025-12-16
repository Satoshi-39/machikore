/**
 * 特集カルーセル取得用hooks
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';

/**
 * リンク種別
 */
export type FeaturedCarouselLinkType = 'tag' | 'map' | 'url';

/**
 * 特集カルーセルアイテムの型
 */
export interface FeaturedCarouselItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_type: FeaturedCarouselLinkType;
  link_value: string | null;
  related_tags: string[] | null;
  display_order: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 有効な特集カルーセルアイテムを取得
 * RLSで is_active=true, 期間内のもののみ返される
 */
async function getFeaturedCarouselItems(): Promise<FeaturedCarouselItem[]> {
  const { data, error } = await supabase
    .from('featured_carousel_items')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    log.error('[FeaturedCarousel] Error:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * 特集カルーセルアイテム一覧を取得するhook
 */
export function useFeaturedCarouselItems() {
  return useQuery<FeaturedCarouselItem[], Error>({
    queryKey: ['featured-carousel-items'],
    queryFn: getFeaturedCarouselItems,
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
