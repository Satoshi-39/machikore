/**
 * 特集アイテム・マガジン取得用hooks
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { supabase } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';
import type { FeaturedItem, Magazine, MagazineSection } from '../model/types';
import type { MagazineMapWithSection } from '../model/lib';
import type { MapWithUser } from '@/shared/types';

// ===============================
// 特集アイテム（カルーセル用）
// ===============================

/**
 * 有効な特集アイテムを取得
 * RLSで is_active=true, 期間内のもののみ返される
 * @param categoryId カテゴリID（'all'または未指定の場合はcategory_id=nullのアイテムを取得）
 */
async function getFeaturedItems(categoryId?: string): Promise<FeaturedItem[]> {
  let query = supabase
    .from('featured_items')
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
    log.error('[Featured] Error:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * 特集アイテム一覧を取得するhook
 * @param categoryId カテゴリID（'all'または未指定の場合は「すべて」用を取得）
 */
export function useFeaturedItems(categoryId?: string) {
  return useQuery<FeaturedItem[], Error>({
    queryKey: QUERY_KEYS.featuredItemsByCategory(categoryId),
    queryFn: () => getFeaturedItems(categoryId),
    // 5分ごとに更新
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 特集アイテムを単体で取得
 */
async function getFeaturedItem(id: string): Promise<FeaturedItem | null> {
  const { data, error } = await supabase
    .from('featured_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    log.error('[Featured] Error:', error);
    throw error;
  }

  return data;
}

/**
 * 特集アイテムを単体で取得するhook
 */
export function useFeaturedItem(id: string | undefined) {
  return useQuery<FeaturedItem | null, Error>({
    queryKey: QUERY_KEYS.featuredItemDetail(id || ''),
    queryFn: () => getFeaturedItem(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ===============================
// マガジン
// ===============================

/**
 * マガジンを単体で取得
 */
async function getMagazine(id: string): Promise<Magazine | null> {
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    log.error('[Magazine] Error:', error);
    throw error;
  }

  return data;
}

/**
 * マガジンを単体で取得するhook
 */
export function useMagazine(id: string | undefined) {
  return useQuery<Magazine | null, Error>({
    queryKey: QUERY_KEYS.magazineDetail(id || ''),
    queryFn: () => getMagazine(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * マガジン一覧を取得（アーカイブページ用）
 */
async function getMagazines(): Promise<Magazine[]> {
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    log.error('[Magazines] Error:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * マガジン一覧を取得するhook
 */
export function useMagazines() {
  return useQuery<Magazine[], Error>({
    queryKey: QUERY_KEYS.magazines(),
    queryFn: getMagazines,
    staleTime: 5 * 60 * 1000,
  });
}

// ===============================
// マガジンマップ
// ===============================

/**
 * マガジンに紐づくマップを取得
 */
async function getMagazineMaps(
  magazineId: string,
  currentUserId?: string | null
): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('magazine_maps')
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
    .eq('magazine_id', magazineId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    log.error('[MagazineMaps] Error:', error);
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
        language: map.language ?? null,
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
 * マガジンマップを取得するhook
 * @param magazineId マガジンID
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
export function useMagazineMaps(
  magazineId: string | undefined,
  currentUserId?: string | null
) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.magazineMaps(magazineId || ''), currentUserId],
    queryFn: () => getMagazineMaps(magazineId!, currentUserId),
    enabled: !!magazineId,
    staleTime: 5 * 60 * 1000,
  });
}

// ===============================
// マガジンセクション
// ===============================

/**
 * マガジンのセクション一覧を取得
 */
async function getMagazineSections(magazineId: string): Promise<MagazineSection[]> {
  const { data, error } = await supabase
    .from('magazine_sections')
    .select('*')
    .eq('magazine_id', magazineId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    log.error('[MagazineSections] Error:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * マガジンのセクション一覧を取得するhook
 */
export function useMagazineSections(magazineId: string | undefined) {
  return useQuery<MagazineSection[], Error>({
    queryKey: QUERY_KEYS.magazineSections(magazineId || ''),
    queryFn: () => getMagazineSections(magazineId!),
    enabled: !!magazineId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * マガジンに紐づくマップをセクション情報付きで取得
 */
async function getMagazineMapsWithSections(
  magazineId: string,
  currentUserId?: string | null
): Promise<MagazineMapWithSection[]> {
  const { data, error } = await supabase
    .from('magazine_maps')
    .select(`
      id,
      display_order,
      section_id,
      map:maps (
        *,
        user:users!maps_user_id_fkey(id, username, display_name, avatar_url),
        likes(id, user_id),
        bookmarks(id, user_id)
      )
    `)
    .eq('magazine_id', magazineId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    log.error('[MagazineMapsWithSections] Error:', error);
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
        language: map.language ?? null,
        is_liked: currentUserId
          ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
          : false,
        is_bookmarked: currentUserId
          ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
          : false,
        section_id: item.section_id,
      };
    });
}

/**
 * マガジンマップをセクション情報付きで取得するhook
 * @param magazineId マガジンID
 * @param currentUserId 現在のユーザーID（いいね・ブックマーク状態取得用）
 */
export function useMagazineMapsWithSections(
  magazineId: string | undefined,
  currentUserId?: string | null
) {
  return useQuery<MagazineMapWithSection[], Error>({
    queryKey: [...QUERY_KEYS.magazineMaps(magazineId || ''), 'withSections', currentUserId],
    queryFn: () => getMagazineMapsWithSections(magazineId!, currentUserId),
    enabled: !!magazineId,
    staleTime: 5 * 60 * 1000,
  });
}
