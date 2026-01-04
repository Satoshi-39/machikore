/**
 * Featured Carousel 型定義
 */

import type { Database } from '@/shared/types/database.types';

/** リンク種別 */
export type FeaturedCarouselLinkType = 'tag' | 'map' | 'url';

/** 特集カルーセルアイテムの型（Database型から取得） */
export type FeaturedCarouselItem = Database['public']['Tables']['featured_carousel_items']['Row'];
