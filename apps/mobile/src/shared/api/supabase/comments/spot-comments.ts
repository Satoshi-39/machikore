/**
 * スポットコメント関連API
 */

import { supabase, handleSupabaseError } from '../client';
import type { CommentWithUser } from './types';
import { mapComment } from './helpers';

/**
 * スポットのコメント一覧を取得（トップレベルのみ）
 */
export async function getSpotComments(
  spotId: string,
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string | null
): Promise<CommentWithUser[]> {
  const { data, error } = await supabase
    .from('comments')
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
    .eq('user_spot_id', spotId)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    handleSupabaseError('getSpotComments', error);
  }

  return (data || []).map((comment: any) => mapComment(comment, currentUserId));
}

/**
 * スポットにコメントを追加
 */
export async function addSpotComment(
  userId: string,
  spotId: string,
  content: string
): Promise<CommentWithUser> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      user_spot_id: spotId,
      content,
      depth: 0,
    })
    .select(`
      *,
      user:users!comments_user_id_fkey (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    handleSupabaseError('addSpotComment', error);
  }

  // comments_countはトリガーで自動更新される

  return mapComment(data);
}

/**
 * スポットのコメント数を取得（トップレベルのみ）
 */
export async function getSpotCommentsCount(spotId: string): Promise<number> {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_spot_id', spotId)
    .is('parent_id', null);

  if (error) {
    handleSupabaseError('getSpotCommentsCount', error);
  }

  return count ?? 0;
}
