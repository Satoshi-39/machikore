/**
 * コレクション操作
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';
import type { ThumbnailCrop } from '@/shared/lib/image';
import type { Collection, CollectionWithUser } from './types';

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
export async function getCollectionById(
  collectionId: string,
  currentUserId?: string | null
): Promise<CollectionWithUser | null> {
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

  // いいね状態を取得
  let isLiked = false;
  if (currentUserId) {
    const { data: likeData } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', currentUserId)
      .eq('collection_id', collectionId)
      .maybeSingle();
    isLiked = likeData !== null;
  }

  return {
    ...data,
    user: data.users || null,
    is_liked: isLiked,
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
    thumbnailCrop?: ThumbnailCrop | null;
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
      thumbnail_crop: options?.thumbnailCrop || null,
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
    thumbnail_crop?: ThumbnailCrop | null;
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
