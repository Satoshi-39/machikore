/**
 * マップいいね機能
 */

import { supabase, handleSupabaseError } from '../client';
import type { LikeRow, LikeInsert } from '@/shared/types';

/**
 * ユーザーがマップにいいねしているか確認
 */
export async function checkMapLiked(userId: string, mapId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('map_id', mapId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkMapLiked', error);
  }

  return data !== null;
}

/**
 * マップにいいねを追加
 * likes_countはトリガーで自動更新される
 */
export async function addMapLike(userId: string, mapId: string): Promise<LikeRow> {
  const insertData: LikeInsert = {
    user_id: userId,
    map_id: mapId,
  };

  const { data, error } = await supabase
    .from('likes')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    handleSupabaseError('addMapLike', error);
  }

  return data;
}

/**
 * マップのいいねを削除
 * likes_countはトリガーで自動更新される
 */
export async function removeMapLike(userId: string, mapId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('map_id', mapId);

  if (error) {
    handleSupabaseError('removeMapLike', error);
  }
}

/**
 * マップのいいねをトグル
 * @returns いいね後の状態（true: いいね済み, false: いいね解除）
 */
export async function toggleMapLike(userId: string, mapId: string): Promise<boolean> {
  const isLiked = await checkMapLiked(userId, mapId);

  if (isLiked) {
    await removeMapLike(userId, mapId);
    return false;
  } else {
    await addMapLike(userId, mapId);
    return true;
  }
}

/**
 * マップのいいね数を取得
 */
export async function getMapLikesCount(mapId: string): Promise<number> {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('map_id', mapId);

  if (error) {
    handleSupabaseError('getMapLikesCount', error);
  }

  return count ?? 0;
}
