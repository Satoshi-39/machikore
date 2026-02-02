/**
 * コレクションいいね機能
 */

import { supabase, handleSupabaseError } from '../client';
import type { LikeRow, LikeInsert } from '@/shared/types';

/**
 * ユーザーがコレクションにいいねしているか確認
 */
export async function checkCollectionLiked(userId: string, collectionId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('collection_id', collectionId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkCollectionLiked', error);
  }

  return data !== null;
}

/**
 * コレクションにいいねを追加
 * likes_countはトリガーで自動更新される
 */
export async function addCollectionLike(userId: string, collectionId: string): Promise<LikeRow> {
  const insertData: LikeInsert = {
    user_id: userId,
    collection_id: collectionId,
  };

  const { data, error } = await supabase
    .from('likes')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    handleSupabaseError('addCollectionLike', error);
  }

  return data;
}

/**
 * コレクションのいいねを削除
 * likes_countはトリガーで自動更新される
 */
export async function removeCollectionLike(userId: string, collectionId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('collection_id', collectionId);

  if (error) {
    handleSupabaseError('removeCollectionLike', error);
  }
}

/**
 * コレクションのいいねをトグル
 * @returns いいね後の状態（true: いいね済み, false: いいね解除）
 */
export async function toggleCollectionLike(userId: string, collectionId: string): Promise<boolean> {
  const isLiked = await checkCollectionLiked(userId, collectionId);

  if (isLiked) {
    await removeCollectionLike(userId, collectionId);
    return false;
  } else {
    await addCollectionLike(userId, collectionId);
    return true;
  }
}

/**
 * コレクションのいいね数を取得
 */
export async function getCollectionLikesCount(collectionId: string): Promise<number> {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('collection_id', collectionId);

  if (error) {
    handleSupabaseError('getCollectionLikesCount', error);
  }

  return count ?? 0;
}
