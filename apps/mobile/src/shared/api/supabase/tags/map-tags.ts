/**
 * マップタグ操作
 */

import { supabase, handleSupabaseError } from '../client';
import type { Tag } from './types';
import { getOrCreateTag } from './tag-operations';

/**
 * マップにタグを追加
 */
export async function addTagToMap(mapId: string, tagId: string): Promise<void> {
  const { error } = await supabase
    .from('map_tags')
    .insert({ map_id: mapId, tag_id: tagId });

  if (error) {
    // 既に存在する場合は無視
    if (error.code !== '23505') {
      handleSupabaseError('addTagToMap', error);
    }
  }
}

/**
 * マップからタグを削除
 */
export async function removeTagFromMap(
  mapId: string,
  tagId: string
): Promise<void> {
  const { error } = await supabase
    .from('map_tags')
    .delete()
    .eq('map_id', mapId)
    .eq('tag_id', tagId);

  if (error) {
    handleSupabaseError('removeTagFromMap', error);
  }
}

/**
 * マップのタグを取得
 */
export async function getTagsByMapId(mapId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('map_tags')
    .select('tag_id, tags(*)')
    .eq('map_id', mapId);

  if (error) {
    handleSupabaseError('getTagsByMapId', error);
  }

  // tagsのデータを抽出
  return (data || []).map((item: any) => item.tags).filter(Boolean);
}

/**
 * タグが付いているマップIDを取得
 */
export async function getMapIdsByTagId(
  tagId: string,
  limit: number = 50
): Promise<string[]> {
  const { data, error } = await supabase
    .from('map_tags')
    .select('map_id')
    .eq('tag_id', tagId)
    .limit(limit);

  if (error) {
    handleSupabaseError('getMapIdsByTagId', error);
  }

  return (data || []).map((item) => item.map_id);
}

/**
 * マップのタグを一括設定（既存タグを置き換え）
 */
export async function setMapTags(
  mapId: string,
  tagNames: string[]
): Promise<Tag[]> {
  // 1. 既存のタグを全て削除
  const { error: deleteError } = await supabase
    .from('map_tags')
    .delete()
    .eq('map_id', mapId);

  if (deleteError) {
    handleSupabaseError('setMapTags:delete', deleteError);
  }

  if (tagNames.length === 0) {
    return [];
  }

  // 2. 新しいタグを取得または作成し、紐付け
  const tags: Tag[] = [];
  for (const name of tagNames) {
    const tag = await getOrCreateTag(name);
    tags.push(tag);
    await addTagToMap(mapId, tag.id);
  }

  return tags;
}
