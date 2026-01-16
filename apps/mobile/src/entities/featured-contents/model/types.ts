/**
 * Featured / Magazine 型定義
 */

import type { Database } from '@/shared/types/database.types';

/** リンク種別: url=外部リンク, magazine=マガジンページ */
export type FeaturedLinkType = 'url' | 'magazine';

/** 登録元タイプ: tag=タグ一括登録, manual=手動登録 */
export type FeaturedSourceType = 'tag' | 'manual';

/** 特集アイテムの型（Database型から取得） */
export type FeaturedItem = Database['public']['Tables']['featured_items']['Row'];

/** マガジンの型（Database型から取得） */
export type Magazine = Database['public']['Tables']['magazines']['Row'];

/** マガジンマップの型（Database型から取得） */
export type MagazineMap = Database['public']['Tables']['magazine_maps']['Row'];

/** マガジンセクションの型（Database型から取得） */
export type MagazineSection = Database['public']['Tables']['magazine_sections']['Row'];
