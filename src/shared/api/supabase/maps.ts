/**
 * Supabase Maps API
 * 公開マップの取得など
 */

import { supabase } from './client';
import type { MapWithUser, SpotWithDetails } from '@/shared/types';

// ===============================
// 内部用型（Supabaseレスポンス）
// ===============================

interface SupabaseMapResponse {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  is_public: boolean;
  is_default: boolean;
  is_official: boolean;
  thumbnail_url: string | null;
  spots_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
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
    console.error('Failed to fetch public maps:', error);
    throw error;
  }

  // データを整形
  return (data || []).map((map: SupabaseMapResponse) => ({
    id: map.id,
    user_id: map.user_id,
    name: map.name,
    description: map.description,
    category: map.category,
    tags: map.tags,
    is_public: map.is_public,
    is_default: map.is_default,
    is_official: map.is_official,
    thumbnail_url: map.thumbnail_url,
    spots_count: map.spots_count,
    likes_count: map.likes_count,
    created_at: map.created_at,
    updated_at: map.updated_at,
    user: map.users || null,
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
    console.error('Failed to fetch map:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description,
    category: data.category,
    tags: data.tags,
    is_public: data.is_public,
    is_default: data.is_default,
    is_official: data.is_official,
    thumbnail_url: data.thumbnail_url,
    spots_count: data.spots_count,
    likes_count: data.likes_count,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: data.users || null,
  };
}

/**
 * マップに属するスポット一覧を取得
 */
export async function getMapSpots(mapId: string): Promise<SpotWithDetails[]> {
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
      )
    `)
    .eq('map_id', mapId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Failed to fetch map spots:', error);
    throw error;
  }

  return (data || []).map((spot: any) => ({
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
    comments_count: spot.comments_count,
    order_index: spot.order_index,
    created_at: spot.created_at,
    updated_at: spot.updated_at,
    master_spot: spot.master_spots || null,
    user: spot.users || null,
  }));
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
    console.error('Failed to fetch user maps:', error);
    throw error;
  }

  return (data || []).map((map: SupabaseMapResponse) => ({
    id: map.id,
    user_id: map.user_id,
    name: map.name,
    description: map.description,
    category: map.category,
    tags: map.tags,
    is_public: map.is_public,
    is_default: map.is_default,
    is_official: map.is_official,
    thumbnail_url: map.thumbnail_url,
    spots_count: map.spots_count,
    likes_count: map.likes_count,
    created_at: map.created_at,
    updated_at: map.updated_at,
    user: map.users || null,
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
    console.error('Failed to fetch user maps:', error);
    throw error;
  }

  return (data || []).map((map: SupabaseMapResponse) => ({
    id: map.id,
    user_id: map.user_id,
    name: map.name,
    description: map.description,
    category: map.category,
    tags: map.tags,
    is_public: map.is_public,
    is_default: map.is_default,
    is_official: map.is_official,
    thumbnail_url: map.thumbnail_url,
    spots_count: map.spots_count,
    likes_count: map.likes_count,
    created_at: map.created_at,
    updated_at: map.updated_at,
    user: map.users || null,
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
  category?: string | null;
  tags?: string[] | null;
  is_public: boolean;
  is_default?: boolean;
  is_official?: boolean;
  thumbnail_url?: string | null;
}

/**
 * 新しいマップを作成
 */
export async function createMap(params: CreateMapParams): Promise<MapWithUser> {
  console.log('[createMap] Creating map:', params);

  const { data, error } = await supabase
    .from('maps')
    .insert({
      id: params.id,
      user_id: params.user_id,
      name: params.name,
      description: params.description || null,
      category: params.category || null,
      tags: params.tags || null,
      is_public: params.is_public,
      is_default: params.is_default || false,
      is_official: params.is_official || false,
      thumbnail_url: params.thumbnail_url || null,
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
    console.error('[createMap] Failed:', error);
    throw error;
  }

  console.log('[createMap] Success:', data);

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description,
    category: data.category,
    tags: data.tags,
    is_public: data.is_public,
    is_default: data.is_default,
    is_official: data.is_official,
    thumbnail_url: data.thumbnail_url,
    spots_count: data.spots_count,
    likes_count: data.likes_count,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: data.users || null,
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
  tags?: string[] | null;
  is_public?: boolean;
  thumbnail_url?: string | null;
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
    console.error('[updateMap] Error:', error);
    throw error;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description,
    category: data.category,
    tags: data.tags,
    is_public: data.is_public,
    is_default: data.is_default,
    is_official: data.is_official,
    thumbnail_url: data.thumbnail_url,
    spots_count: data.spots_count,
    likes_count: data.likes_count,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: data.users || null,
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
    console.error('[deleteMap] Error:', error);
    throw error;
  }
}
