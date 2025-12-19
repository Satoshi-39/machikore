/**
 * タグAPI（Supabase）
 */

import { supabase, handleSupabaseError } from './client';

// ===============================
// 型定義
// ===============================

export interface Tag {
  id: string;
  name: string;
  name_translations: { [key: string]: string } | null;
  slug: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface MapTag {
  id: string;
  map_id: string;
  tag_id: string;
  created_at: string;
}

export interface SpotTag {
  id: string;
  user_spot_id: string;
  tag_id: string;
  created_at: string;
}

// ===============================
// API関数
// ===============================

/**
 * 人気タグを取得（使用数順）
 */
export async function getPopularTags(limit: number = 20): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('usage_count', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getPopularTags', error);
  }

  return data || [];
}

/**
 * タグを検索（オートコンプリート用）
 */
export async function searchTags(query: string, limit: number = 10): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('usage_count', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('searchTags', error);
  }

  return data || [];
}

/**
 * IDでタグを取得
 */
export async function getTagById(tagId: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', tagId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getTagById', error);
  }

  return data;
}

/**
 * 名前でタグを取得
 */
export async function getTagByName(name: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getTagByName', error);
  }

  return data;
}

/**
 * タグを作成（存在しない場合）
 */
export async function createTag(name: string): Promise<Tag> {
  // slugを生成（日本語対応）
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const { data, error } = await supabase
    .from('tags')
    .insert({ name, slug })
    .select()
    .single();

  if (error) {
    // 既に存在する場合は取得
    if (error.code === '23505') {
      const existing = await getTagByName(name);
      if (existing) return existing;
    }
    handleSupabaseError('createTag', error);
  }

  return data!;
}

/**
 * タグを取得または作成
 */
export async function getOrCreateTag(name: string): Promise<Tag> {
  const existing = await getTagByName(name);
  if (existing) return existing;
  return createTag(name);
}

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
export async function removeTagFromMap(mapId: string, tagId: string): Promise<void> {
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
export async function getMapIdsByTagId(tagId: string, limit: number = 50): Promise<string[]> {
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
export async function setMapTags(mapId: string, tagNames: string[]): Promise<Tag[]> {
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

// ===============================
// スポット用タグAPI
// ===============================

/**
 * スポットにタグを追加
 */
export async function addTagToSpot(userSpotId: string, tagId: string): Promise<void> {
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
export async function removeTagFromSpot(userSpotId: string, tagId: string): Promise<void> {
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
export async function setSpotTags(userSpotId: string, tagNames: string[]): Promise<Tag[]> {
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
export async function getSpotIdsByTagId(tagId: string, limit: number = 50): Promise<string[]> {
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

// ===============================
// ヘルパー関数
// ===============================

// ===============================
// カテゴリ別タグAPI
// ===============================

/**
 * カテゴリ別の運営選定タグを取得
 */
export async function getFeaturedTagsByCategory(categoryId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('category_featured_tags')
    .select('tag_id, tags(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    handleSupabaseError('getFeaturedTagsByCategory', error);
  }

  return (data || []).map((item: any) => item.tags).filter(Boolean);
}

/**
 * カテゴリ別の人気タグを取得（自動集計）
 * そのカテゴリのマップで多く使われているタグを返す
 */
export async function getPopularTagsByCategory(
  categoryId: string,
  limit: number = 10
): Promise<Tag[]> {
  // map_tagsからカテゴリに属するマップのタグを集計
  const { data, error } = await supabase.rpc('get_popular_tags_by_category', {
    p_category_id: categoryId,
    p_limit: limit,
  });

  if (error) {
    // RPC関数がない場合はフォールバック
    console.warn('get_popular_tags_by_category RPC not found, using fallback');
    return getPopularTagsByCategoryFallback(categoryId, limit);
  }

  return data || [];
}

/**
 * カテゴリ別人気タグのフォールバック実装
 */
async function getPopularTagsByCategoryFallback(
  categoryId: string,
  limit: number
): Promise<Tag[]> {
  // 1. カテゴリに属するマップIDを取得
  const { data: maps, error: mapsError } = await supabase
    .from('maps')
    .select('id')
    .eq('category_id', categoryId)
    .eq('is_public', true);

  if (mapsError || !maps || maps.length === 0) {
    return [];
  }

  const mapIds = maps.map((m) => m.id);

  // 2. これらのマップに紐づくタグを取得
  const { data: mapTags, error: tagsError } = await supabase
    .from('map_tags')
    .select('tag_id, tags(*)')
    .in('map_id', mapIds);

  if (tagsError || !mapTags) {
    return [];
  }

  // 3. タグごとに出現回数をカウントしてソート
  const tagCounts = new Map<string, { tag: Tag; count: number }>();
  for (const item of mapTags) {
    const tag = (item as any).tags as Tag | null;
    if (!tag) continue;

    const existing = tagCounts.get(tag.id);
    if (existing) {
      existing.count++;
    } else {
      tagCounts.set(tag.id, { tag, count: 1 });
    }
  }

  // 4. カウント順にソートしてlimit件返す
  return Array.from(tagCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((item) => item.tag);
}

/**
 * カテゴリ別タグを取得（ハイブリッド: 運営選定 + 人気）
 * 運営選定タグを優先し、足りない分を人気タグで補う
 */
export async function getCategoryTags(
  categoryId: string,
  limit: number = 10
): Promise<Tag[]> {
  // 1. 運営選定タグを取得
  const featuredTags = await getFeaturedTagsByCategory(categoryId);

  // 運営選定タグだけで足りる場合
  if (featuredTags.length >= limit) {
    return featuredTags.slice(0, limit);
  }

  // 2. 人気タグを取得して補完
  const popularTags = await getPopularTagsByCategory(categoryId, limit);

  // 重複を除いてマージ
  const featuredTagIds = new Set(featuredTags.map((t) => t.id));
  const additionalTags = popularTags.filter((t) => !featuredTagIds.has(t.id));

  return [...featuredTags, ...additionalTags].slice(0, limit);
}

/**
 * タグ名を現在の言語で取得
 */
export function getTagName(tag: Tag, locale: string = 'ja'): string {
  // デフォルト言語（日本語）の場合はそのまま返す
  if (locale === 'ja') {
    return tag.name;
  }

  // 他言語の翻訳があれば返す
  if (tag.name_translations && tag.name_translations[locale]) {
    return tag.name_translations[locale];
  }

  // 翻訳がなければデフォルト名を返す
  return tag.name;
}
