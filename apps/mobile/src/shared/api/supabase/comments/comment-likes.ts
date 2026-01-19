/**
 * コメントいいね関連API
 */

import { supabase, handleSupabaseError } from '../client';
import { log } from '@/shared/config/logger';

/**
 * コメントにいいねを追加
 */
export async function likeComment(userId: string, commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comment_likes')
    .insert({ user_id: userId, comment_id: commentId });

  if (error) {
    // 重複エラーは無視（既にいいね済み）
    if (error.code === '23505') return;
    handleSupabaseError('likeComment', error);
  }
}

/**
 * コメントのいいねを取り消し
 */
export async function unlikeComment(userId: string, commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comment_likes')
    .delete()
    .eq('user_id', userId)
    .eq('comment_id', commentId);

  if (error) {
    handleSupabaseError('unlikeComment', error);
  }
}

/**
 * コメントのいいね状態を取得
 */
export async function isCommentLiked(userId: string, commentId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('comment_id', commentId)
    .maybeSingle();

  if (error) {
    log.error('[Comments] Error:', error);
    return false;
  }

  return !!data;
}

