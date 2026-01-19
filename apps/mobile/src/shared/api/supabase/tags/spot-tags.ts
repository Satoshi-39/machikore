/**
 * スポットタグ操作
 */

import { supabase, handleSupabaseError } from '../client';
import type { Tag } from './types';
import { getOrCreateTag } from './tag-operations';

/**
 * スポットにタグを追加
 */
export async function addTagToSpot(
  userSpotId: string,
  tagId: string
): Promise<void> {
  const { error } = await supabase
    .from('spot_tags')
    .insert({ user_spot_id: userSpotId, tag_id: tagId });

  if (error) {
    // 既に存在する場合は無視
    if (error.code !== '23505') {
      handleSupabaseError('addTagToSpot', error);
    }
  }
}

/**
 * スポットからタグを削除
 */
export async function removeTagFromSpot(
  userSpotId: string,
  tagId: string
): Promise<void> {
  const { error } = await supabase
    .from('spot_tags')
    .delete()
    .eq('user_spot_id', userSpotId)
    .eq('tag_id', tagId);

  if (error) {
    handleSupabaseError('removeTagFromSpot', error);
  }
}

/**
 * スポットのタグを取得
 */
export async function getTagsBySpotId(userSpotId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('spot_tags')
    .select('tag_id, tags(*)')
    .eq('user_spot_id', userSpotId);

  if (error) {
    handleSupabaseError('getTagsBySpotId', error);
  }

  // tagsのデータを抽出
  return (data || []).map((item: any) => item.tags).filter(Boolean);
}

/**
 * スポットのタグを一括設定（既存タグを置き換え）
 */
export async function setSpotTags(
  userSpotId: string,
  tagNames: string[]
): Promise<Tag[]> {
  // 1. 既存のタグを全て削除
  const { error: deleteError } = await supabase
    .from('spot_tags')
    .delete()
    .eq('user_spot_id', userSpotId);

  if (deleteError) {
    handleSupabaseError('setSpotTags:delete', deleteError);
  }

  if (tagNames.length === 0) {
    return [];
  }

  // 2. 新しいタグを取得または作成し、紐付け
  const tags: Tag[] = [];
  for (const name of tagNames) {
    const tag = await getOrCreateTag(name);
    tags.push(tag);
    await addTagToSpot(userSpotId, tag.id);
  }

  return tags;
}

/**
 * タグが付いているスポットIDを取得
 */
export async function getSpotIdsByTagId(
  tagId: string,
  limit: number = 50
): Promise<string[]> {
  const { data, error } = await supabase
    .from('spot_tags')
    .select('user_spot_id')
    .eq('tag_id', tagId)
    .limit(limit);

  if (error) {
    handleSupabaseError('getSpotIdsByTagId', error);
  }

  return (data || []).map((item) => item.user_spot_id);
}
