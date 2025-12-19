/**
 * カテゴリ別マップ取得
 */

import { supabase } from '../client';
import type { MapWithUser } from '@/shared/types';
import { log } from '@/shared/config/logger';

/**
 * カテゴリ別人気マップを取得（いいね数順）
 * @param categoryId カテゴリID
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
export async function getPopularMapsByCategory(
  categoryId: string,
  limit: number = 10,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      likes(id, user_id),
      bookmarks(id, user_id)
    `)
    .eq('is_public', true)
    .eq('category_id', categoryId)
    .order('likes_count', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error getting popular maps by category:', error);
    return [];
  }

  return (data || []).map((map: any) => ({
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
    theme_color: map.theme_color,
    spots_count: map.spots_count,
    likes_count: map.likes_count,
    bookmarks_count: map.bookmarks_count ?? 0,
    comments_count: map.comments_count ?? 0,
    created_at: map.created_at,
    updated_at: map.updated_at,
    user: map.users || null,
    is_article_public: map.is_article_public ?? false,
    article_intro: map.article_intro ?? null,
    article_outro: map.article_outro ?? null,
    is_liked: currentUserId
      ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
      : false,
    is_bookmarked: currentUserId
      ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
      : false,
  }));
}

/**
 * カテゴリ別新着マップを取得（作成日順）
 * @param categoryId カテゴリID
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
export async function getLatestMapsByCategory(
  categoryId: string,
  limit: number = 10,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      likes(id, user_id),
      bookmarks(id, user_id)
    `)
    .eq('is_public', true)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error getting latest maps by category:', error);
    return [];
  }

  return (data || []).map((map: any) => ({
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
    theme_color: map.theme_color,
    spots_count: map.spots_count,
    likes_count: map.likes_count,
    bookmarks_count: map.bookmarks_count ?? 0,
    comments_count: map.comments_count ?? 0,
    created_at: map.created_at,
    updated_at: map.updated_at,
    user: map.users || null,
    is_article_public: map.is_article_public ?? false,
    article_intro: map.article_intro ?? null,
    article_outro: map.article_outro ?? null,
    is_liked: currentUserId
      ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
      : false,
    is_bookmarked: currentUserId
      ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
      : false,
  }));
}
