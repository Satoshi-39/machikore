/**
 * マップ検索（発見タブ用）
 */

import { supabase } from '../client';
import type { MapWithUser } from '@/shared/types';
import { mapResponseToMapWithUser, type SupabaseMapResponse } from './types';
import { log } from '@/shared/config/logger';

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

  return (data || []).map((map: SupabaseMapResponse) => mapResponseToMapWithUser(map));
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

  // 3. マップ詳細を取得
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
    .in('id', mapIds)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Maps] Error:', error);
    return [];
  }

  return (data || []).map((map: SupabaseMapResponse) => mapResponseToMapWithUser(map));
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

  return (data || []).map((map: SupabaseMapResponse) => mapResponseToMapWithUser(map));
}
