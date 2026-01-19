/**
 * コメント共通操作（更新・削除）
 */

import { supabase, handleSupabaseError } from '../client';
import type { CommentWithUser } from '@/shared/types';
import { mapComment } from './types';

/**
 * コメントを更新
 */
export async function updateComment(commentId: string, content: string): Promise<CommentWithUser> {
  const { data, error } = await supabase
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select(`
      *,
      user:users!comments_user_id_fkey (
        id,
        username,
        display_name,
        avatar_url
      ),
      comment_likes (
        user_id
      )
    `)
    .single();

  if (error) {
    handleSupabaseError('updateComment', error);
  }

  return mapComment(data);
}

/**
 * コメントを削除
 * comments_countはトリガーで自動更新される
 */
export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    handleSupabaseError('deleteComment', error);
  }

  // comments_countはトリガーで自動更新される
}
