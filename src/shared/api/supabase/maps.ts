/**
 * Supabase Maps API
 * 公開マップの取得など
 */

import { supabase, handleSupabaseError } from './client';
import type { MapWithUser, SpotWithDetails, MapArticleData, SpotWithImages } from '@/shared/types';
import { log } from '@/shared/config/logger';

// ===============================
// 内部用型（Supabaseレスポンス）
// ===============================

interface SupabaseMapResponse {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  category_id: string | null;
  is_public: boolean;
  is_default: boolean;
  is_official: boolean;
  thumbnail_url: string | null;
  theme_color: string | null;
  spots_count: number;
  likes_count: number;
  bookmarks_count: number | null;
  comments_count: number | null;
  created_at: string;
  updated_at: string;
  is_article_public: boolean | null;
  users?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

// ===============================
// 公開マップ取得
// ===============================

/**
 * 公開マップ一覧を取得（フィード用）
 * ユーザー情報も含めて取得
 */
export async function getPublicMaps(
  limit: number = 50,
  offset: number = 0
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
      )
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    handleSupabaseError('getPublicMaps', error);
  }

  // データを整形
  return (data || []).map((map: SupabaseMapResponse) => ({
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
  }));
}

/**
 * マップ詳細を取得（IDで）
 */
export async function getMapById(mapId: string): Promise<MapWithUser | null> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('id', mapId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    handleSupabaseError('getMapById', error);
  }

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description,
    category: data.category,
    category_id: data.category_id,
    is_public: data.is_public,
    is_default: data.is_default,
    is_official: data.is_official,
    thumbnail_url: data.thumbnail_url,
    theme_color: data.theme_color,
    spots_count: data.spots_count,
    likes_count: data.likes_count,
    bookmarks_count: data.bookmarks_count ?? 0,
    comments_count: data.comments_count ?? 0,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: data.users || null,
    is_article_public: data.is_article_public ?? false,
  };
}

/**
 * マップに属するスポット一覧を取得
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export async function getMapSpots(
  mapId: string,
  currentUserId?: string | null
): Promise<SpotWithDetails[]> {
  const { data, error } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*),
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('map_id', mapId)
    .order('order_index', { ascending: true });

  if (error) {
    handleSupabaseError('getMapSpots', error);
  }

  return (data || []).map((spot: any) => {
    // 現在のユーザーがいいねしているかチェック
    const isLiked = currentUserId
      ? (spot.likes || []).some((like: any) => like.user_id === currentUserId)
      : false;

    return {
      id: spot.id,
      user_id: spot.user_id,
      map_id: spot.map_id,
      master_spot_id: spot.master_spot_id,
      machi_id: spot.machi_id,
      custom_name: spot.custom_name,
      description: spot.description,
      tags: spot.tags,
      images_count: spot.images_count,
      likes_count: spot.likes_count,
      bookmarks_count: spot.bookmarks_count ?? 0,
      comments_count: spot.comments_count,
      order_index: spot.order_index,
      created_at: spot.created_at,
      updated_at: spot.updated_at,
      latitude: spot.latitude,
      longitude: spot.longitude,
      google_formatted_address: spot.google_formatted_address,
      google_short_address: spot.google_short_address,
      master_spot: spot.master_spots || null,
      user: spot.users || null,
      is_liked: isLiked,
    };
  });
}

/**
 * ユーザーの公開マップを取得
 */
export async function getUserPublicMaps(userId: string): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    handleSupabaseError('getUserPublicMaps', error);
  }

  return (data || []).map((map: SupabaseMapResponse) => ({
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
  }));
}

/**
 * ユーザーの全マップを取得（公開・非公開含む）
 */
export async function getUserMaps(userId: string): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    handleSupabaseError('getUserMaps', error);
  }

  return (data || []).map((map: SupabaseMapResponse) => ({
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
  }));
}

// ===============================
// マップ作成
// ===============================

export interface CreateMapParams {
  id: string; // UUID
  user_id: string;
  name: string;
  description?: string | null;
  category_id: string;
  is_public: boolean;
  is_default?: boolean;
  is_official?: boolean;
  thumbnail_url?: string | null;
  theme_color?: string;
}

/**
 * 新しいマップを作成
 */
export async function createMap(params: CreateMapParams): Promise<MapWithUser> {
  log.debug('[Maps] Creating map:', params);

  const { data, error } = await supabase
    .from('maps')
    .insert({
      id: params.id,
      user_id: params.user_id,
      name: params.name,
      description: params.description || null,
      category_id: params.category_id,
      is_public: params.is_public,
      is_default: params.is_default || false,
      is_official: params.is_official || false,
      thumbnail_url: params.thumbnail_url || null,
      theme_color: params.theme_color || 'pink',
      spots_count: 0,
      likes_count: 0,
    })
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    handleSupabaseError('createMap', error);
  }

  log.info('[Maps] Success:', data);

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description,
    category: data.category,
    category_id: data.category_id,
    is_public: data.is_public,
    is_default: data.is_default,
    is_official: data.is_official,
    thumbnail_url: data.thumbnail_url,
    theme_color: data.theme_color,
    spots_count: data.spots_count,
    likes_count: data.likes_count,
    bookmarks_count: data.bookmarks_count ?? 0,
    comments_count: data.comments_count ?? 0,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: data.users || null,
    is_article_public: data.is_article_public ?? false,
  };
}

// ===============================
// マップ更新
// ===============================

export interface UpdateMapParams {
  id: string;
  name?: string;
  description?: string | null;
  category?: string | null;
  category_id?: string | null;
  is_public?: boolean;
  is_article_public?: boolean;
  thumbnail_url?: string | null;
  theme_color?: string;
}

/**
 * マップを更新
 */
export async function updateMap(params: UpdateMapParams): Promise<MapWithUser> {
  const { id, ...updateData } = params;

  const { data, error } = await supabase
    .from('maps')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    handleSupabaseError('updateMap', error);
  }

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description,
    category: data.category,
    category_id: data.category_id,
    is_public: data.is_public,
    is_default: data.is_default,
    is_official: data.is_official,
    thumbnail_url: data.thumbnail_url,
    theme_color: data.theme_color,
    spots_count: data.spots_count,
    likes_count: data.likes_count,
    bookmarks_count: data.bookmarks_count ?? 0,
    comments_count: data.comments_count ?? 0,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: data.users || null,
    is_article_public: data.is_article_public ?? false,
  };
}

// ===============================
// マップ削除
// ===============================

/**
 * マップを削除（関連するスポットも自動削除される）
 */
export async function deleteMap(mapId: string): Promise<void> {
  const { error } = await supabase
    .from('maps')
    .delete()
    .eq('id', mapId);

  if (error) {
    handleSupabaseError('deleteMap', error);
  }
}

// ===============================
// マップ記事
// ===============================

/**
 * マップ記事データを取得（マップ + スポット一覧 + 画像）
 */
export async function getMapArticle(
  mapId: string,
  currentUserId?: string | null
): Promise<MapArticleData | null> {
  // マップ情報を取得
  const map = await getMapById(mapId);
  if (!map) return null;

  // スポット一覧を画像付きで取得
  const { data: spotsData, error: spotsError } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*),
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      images (
        id,
        cloud_path,
        order_index
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('map_id', mapId)
    .order('order_index', { ascending: true });

  if (spotsError) {
    handleSupabaseError('getMapArticle', spotsError);
  }

  const spots: SpotWithImages[] = (spotsData || []).map((spot: any) => {
    const isLiked = currentUserId
      ? (spot.likes || []).some((like: any) => like.user_id === currentUserId)
      : false;

    return {
      id: spot.id,
      user_id: spot.user_id,
      map_id: spot.map_id,
      master_spot_id: spot.master_spot_id,
      machi_id: spot.machi_id,
      custom_name: spot.custom_name,
      description: spot.description,
      tags: spot.tags,
      images_count: spot.images_count,
      likes_count: spot.likes_count,
      bookmarks_count: spot.bookmarks_count ?? 0,
      comments_count: spot.comments_count,
      order_index: spot.order_index,
      created_at: spot.created_at,
      updated_at: spot.updated_at,
      latitude: spot.latitude,
      longitude: spot.longitude,
      google_formatted_address: spot.google_formatted_address,
      google_short_address: spot.google_short_address,
      master_spot: spot.master_spots || null,
      user: spot.users || null,
      is_liked: isLiked,
      article_content: spot.article_content || null,
      images: (spot.images || []).sort((a: any, b: any) => a.order_index - b.order_index),
    };
  });

  return { map, spots };
}

/**
 * スポットの記事内容を更新
 */
export async function updateSpotArticleContent(
  spotId: string,
  articleContent: string | null
): Promise<void> {
  const { error } = await supabase
    .from('user_spots')
    .update({
      article_content: articleContent,
      updated_at: new Date().toISOString(),
    })
    .eq('id', spotId);

  if (error) {
    handleSupabaseError('updateSpotArticleContent', error);
  }
}

// ===============================
// マップ検索（発見タブ用）
// ===============================

/**
 * 公開マップをキーワードで検索（Supabase版）
 * 発見タブの検索で使用
 */
export async function searchPublicMaps(
  query: string,
  limit: number = 30
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
      )
    `)
    .eq('is_public', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error:', error);
    return [];
  }

  return (data || []).map((map: SupabaseMapResponse) => ({
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
  }));
}

/**
 * タグで公開マップを検索
 * @param tag 検索するタグ名
 */
export async function searchPublicMapsByTag(
  tag: string,
  limit: number = 50
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
      )
    `)
    .eq('is_public', true)
    .contains('tags', [tag])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error:', error);
    return [];
  }

  return (data || []).map((map: SupabaseMapResponse) => ({
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
  }));
}

/**
 * カテゴリIDで公開マップを検索
 * @param categoryId カテゴリID（categories.id）
 */
export async function searchPublicMapsByCategoryId(
  categoryId: string,
  limit: number = 50
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
      )
    `)
    .eq('is_public', true)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error searching by category:', error);
    return [];
  }

  return (data || []).map((map: SupabaseMapResponse) => ({
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
  }));
}

/**
 * フォロー中ユーザーの公開マップ一覧を取得
 * @param userId 現在のユーザーID
 */
export async function getFollowingUsersMaps(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<MapWithUser[]> {
  // 1. フォロー中のユーザーIDを取得
  const { data: followsData, error: followsError } = await supabase
    .from('follows')
    .select('followee_id')
    .eq('follower_id', userId);

  if (followsError) {
    handleSupabaseError('getFollowingUsersMaps:follows', followsError);
  }

  const followingUserIds = (followsData || []).map((f) => f.followee_id);

  // フォロー中のユーザーがいない場合は空配列を返す
  if (followingUserIds.length === 0) {
    return [];
  }

  // 2. フォロー中ユーザーの公開マップを取得
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('is_public', true)
    .in('user_id', followingUserIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    handleSupabaseError('getFollowingUsersMaps', error);
  }

  return (data || []).map((map: SupabaseMapResponse) => ({
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
  }));
}
