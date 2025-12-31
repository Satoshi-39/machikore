/**
 * Supabase Collections API
 * コレクション機能（マップをまとめるマガジン的機能）
 */

import { supabase } from './client';
import { log } from '@/shared/config/logger';
import type { Database } from '@/shared/types/database.types';

// ===============================
// 型定義
// ===============================

// MergeDeepで拡張されたDatabase型から取得
export type Collection = Database['public']['Tables']['collections']['Row'];

export interface CollectionWithUser extends Collection {
  user: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

// collection_mapsテーブルの型
export type CollectionMap = Database['public']['Tables']['collection_maps']['Row'];

export interface CollectionMapWithDetails extends CollectionMap {
  map: {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    spots_count: number;
    likes_count: number;
    bookmarks_count: number;
    is_public: boolean;
    is_article_public: boolean;
    created_at: string;
    user: {
      id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  } | null;
}

// ===============================
// コレクション操作
// ===============================

/**
 * ユーザーのコレクション一覧を取得
 */
export async function getUserCollections(userId: string): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)
    .order('order_index', { ascending: true });

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }

  return data || [];
}

/**
 * コレクションを取得（ID指定）
 */
export async function getCollectionById(collectionId: string): Promise<CollectionWithUser | null> {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('id', collectionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    log.error('[Collections] Error:', error);
    throw error;
  }

  return {
    ...data,
    user: data.users || null,
  };
}

/**
 * 公開コレクション一覧を取得（フィード用）
 */
export async function getPublicCollections(
  limit: number = 20,
  offset: number = 0
): Promise<CollectionWithUser[]> {
  const { data, error } = await supabase
    .from('collections')
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
    log.error('[Collections] Error:', error);
    throw error;
  }

  return (data || []).map((item: any) => ({
    ...item,
    user: item.users || null,
  }));
}

/**
 * コレクションを作成
 */
export async function createCollection(
  userId: string,
  name: string,
  options?: {
    description?: string;
    thumbnailUrl?: string;
    color?: string;
    isPublic?: boolean;
  }
): Promise<Collection> {
  // 最大のorder_indexを取得
  const { data: existing } = await supabase
    .from('collections')
    .select('order_index')
    .eq('user_id', userId)
    .order('order_index', { ascending: false })
    .limit(1);

  const lastOrderIndex = existing?.[0]?.order_index ?? -1;
  const nextOrderIndex = lastOrderIndex + 1;

  const { data, error } = await supabase
    .from('collections')
    .insert({
      user_id: userId,
      name,
      description: options?.description || null,
      thumbnail_url: options?.thumbnailUrl || null,
      color: options?.color || null,
      is_public: options?.isPublic ?? false,
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }

  return data;
}

/**
 * コレクションを更新
 */
export async function updateCollection(
  collectionId: string,
  userId: string,
  updates: {
    name?: string;
    description?: string | null;
    thumbnail_url?: string | null;
    color?: string | null;
    is_public?: boolean;
    order_index?: number;
  }
): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .update(updates)
    .eq('id', collectionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }

  return data;
}

/**
 * コレクションを削除
 */
export async function deleteCollection(collectionId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId)
    .eq('user_id', userId);

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }
}

// ===============================
// コレクション内マップ操作
// ===============================

/**
 * コレクション内のマップ一覧を取得
 */
export async function getCollectionMaps(
  collectionId: string
): Promise<CollectionMapWithDetails[]> {
  const { data, error } = await supabase
    .from('collection_maps')
    .select(`
      *,
      maps (
        id,
        user_id,
        name,
        description,
        thumbnail_url,
        spots_count,
        likes_count,
        bookmarks_count,
        is_public,
        is_article_public,
        created_at,
        users (
          id,
          username,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('collection_id', collectionId)
    .order('order_index', { ascending: true });

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }

  return (data || []).map((item: any) => ({
    ...item,
    map: item.maps
      ? {
          ...item.maps,
          user: item.maps.users || null,
        }
      : null,
  }));
}

/**
 * コレクションにマップを追加
 */
export async function addMapToCollection(
  collectionId: string,
  mapId: string
): Promise<CollectionMap> {
  // 最大のorder_indexを取得
  const { data: existing } = await supabase
    .from('collection_maps')
    .select('order_index')
    .eq('collection_id', collectionId)
    .order('order_index', { ascending: false })
    .limit(1);

  const lastOrderIndex = existing?.[0]?.order_index ?? -1;
  const nextOrderIndex = lastOrderIndex + 1;

  const { data, error } = await supabase
    .from('collection_maps')
    .insert({
      collection_id: collectionId,
      map_id: mapId,
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }

  return data;
}

/**
 * コレクションからマップを削除
 */
export async function removeMapFromCollection(
  collectionId: string,
  mapId: string
): Promise<void> {
  const { error } = await supabase
    .from('collection_maps')
    .delete()
    .eq('collection_id', collectionId)
    .eq('map_id', mapId);

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }
}

/**
 * コレクション内マップの並び順を更新
 */
export async function updateCollectionMapOrder(
  collectionId: string,
  mapId: string,
  orderIndex: number
): Promise<void> {
  const { error } = await supabase
    .from('collection_maps')
    .update({ order_index: orderIndex })
    .eq('collection_id', collectionId)
    .eq('map_id', mapId);

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }
}

/**
 * マップが特定のコレクションに含まれているか確認
 */
export async function checkMapInCollection(
  collectionId: string,
  mapId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('collection_maps')
    .select('id')
    .eq('collection_id', collectionId)
    .eq('map_id', mapId)
    .maybeSingle();

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }

  return data !== null;
}

/**
 * マップがどのコレクションに含まれているか取得
 */
export async function getMapCollections(
  mapId: string,
  userId: string
): Promise<{ collection_id: string }[]> {
  const { data, error } = await supabase
    .from('collection_maps')
    .select(`
      collection_id,
      collections!inner (
        user_id
      )
    `)
    .eq('map_id', mapId)
    .eq('collections.user_id', userId);

  if (error) {
    log.error('[Collections] Error:', error);
    throw error;
  }

  return (data || []).map((item: any) => ({
    collection_id: item.collection_id,
  }));
}
