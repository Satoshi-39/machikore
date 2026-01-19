/**
 * マップ検索（発見タブ用）
 */

import { supabase } from '../client';
import type { MapWithUser } from '@/shared/types';
import {
  mapResponseToMapWithUser,
  rpcMapResponseToMapWithUser,
  type SearchPublicMapsRpcRow,
  type MapSearchFilters,
} from './types';
import { log } from '@/shared/config/logger';

/**
 * 公開マップをキーワードで検索（RPC版）
 *
 * @param query 検索キーワード（空文字可）
 * @param filters フィルター条件
 * @param limit 取得件数
 */
export async function searchPublicMaps(
  query: string,
  filters?: MapSearchFilters,
  limit: number = 30
): Promise<MapWithUser[]> {
  const { data, error } = await supabase.rpc('search_public_maps', {
    search_query: query || undefined,
    result_limit: limit,
    tag_ids_filter: filters?.tagIds || undefined,
    sort_by: filters?.sortBy || 'created_at',
    date_range: filters?.dateRange || 'all',
    region_text: filters?.regionText || undefined,
  });

  if (error) {
    log.error('[Maps] searchPublicMaps error:', error);
    return [];
  }

  // RPC結果をMapWithUser型に変換（中間型を経由）
  return (data || []).map((row) =>
    rpcMapResponseToMapWithUser(row as SearchPublicMapsRpcRow)
  );
}

/**
 * タグで公開マップを検索
 * @param tag 検索するタグ名
 */
export async function searchPublicMapsByTag(
  tag: string,
  limit: number = 50
): Promise<MapWithUser[]> {
  // 1. タグ名からタグIDを取得
  const { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select('id')
    .eq('name', tag)
    .single();

  if (tagError || !tagData) {
    log.warn('[Maps] Tag not found:', tag);
    return [];
  }

  // 2. map_tagsからそのタグを持つマップIDを取得
  const { data: mapTagsData, error: mapTagsError } = await supabase
    .from('map_tags')
    .select('map_id')
    .eq('tag_id', tagData.id);

  if (mapTagsError || !mapTagsData || mapTagsData.length === 0) {
    return [];
  }

  const mapIds = mapTagsData.map((mt) => mt.map_id);

  // 3. マップ詳細を取得（タグ情報も含む）
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
      map_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('is_public', true)
    .in('id', mapIds)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error:', error);
    return [];
  }

  return (data || []).map((map) => mapResponseToMapWithUser(map));
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

  return (data || []).map((map) => mapResponseToMapWithUser(map));
}
