/**
 * スポットいいね機能
 */

import { supabase, handleSupabaseError } from '../client';
import type { LikeRow, LikeInsert } from '@/shared/types';

/**
 * ユーザーがスポットにいいねしているか確認
 */
export async function checkSpotLiked(userId: string, spotId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('user_spot_id', spotId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkSpotLiked', error);
  }

  return data !== null;
}

/**
 * スポットにいいねを追加
 * likes_countはトリガーで自動更新される
 */
export async function addSpotLike(userId: string, spotId: string): Promise<LikeRow> {
  const insertData: LikeInsert = {
    user_id: userId,
    user_spot_id: spotId,
  };

  const { data, error } = await supabase
    .from('likes')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    handleSupabaseError('addSpotLike', error);
  }

  return data;
}

/**
 * スポットのいいねを削除
 * likes_countはトリガーで自動更新される
 */
export async function removeSpotLike(userId: string, spotId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('user_spot_id', spotId);

  if (error) {
    handleSupabaseError('removeSpotLike', error);
  }
}

/**
 * スポットのいいねをトグル
 * @returns いいね後の状態（true: いいね済み, false: いいね解除）
 */
export async function toggleSpotLike(userId: string, spotId: string): Promise<boolean> {
  const isLiked = await checkSpotLiked(userId, spotId);

  if (isLiked) {
    await removeSpotLike(userId, spotId);
    return false;
  } else {
    await addSpotLike(userId, spotId);
    return true;
  }
}

/**
 * スポットのいいね数を取得
 */
export async function getSpotLikesCount(spotId: string): Promise<number> {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('user_spot_id', spotId);

  if (error) {
    handleSupabaseError('getSpotLikesCount', error);
  }

  return count ?? 0;
}
