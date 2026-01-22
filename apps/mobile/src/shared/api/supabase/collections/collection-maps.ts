/**
 * コレクション内マップ操作
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';
import { FEED_PAGE_SIZE } from '@/shared/config';
import type { CollectionMap, CollectionMapWithDetails } from './types';

/**
 * コレクション内のマップ一覧を取得（cursor方式ページネーション対応）
 * @param collectionId コレクションID
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（order_index、この値より大きいものを取得）
 */
export async function getCollectionMaps(
  collectionId: string,
  limit: number = FEED_PAGE_SIZE,
  cursor?: number
): Promise<CollectionMapWithDetails[]> {
  let query = supabase
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
    .order('order_index', { ascending: true })
    .limit(limit);

  // cursorが指定されている場合、そのorder_indexより大きいものを取得
  if (cursor !== undefined) {
    query = query.gt('order_index', cursor);
  }

  const { data, error } = await query;

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
