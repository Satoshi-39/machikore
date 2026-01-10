/**
 * マップコメント関連API
 */

import { supabase, handleSupabaseError } from '../client';
import type { CommentWithUser } from './types';
import { mapCommentWithReplyTo } from './helpers';

/**
 * マップのコメント一覧を取得（トップレベルのみ）
 */
export async function getMapComments(
  mapId: string,
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
    .eq('map_id', mapId)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    handleSupabaseError('getMapComments', error);
  }

  return (data || []).map((comment: any) => mapCommentWithReplyTo(comment, currentUserId));
}

/**
 * マップにコメントを追加
 */
export async function addMapComment(
  userId: string,
  mapId: string,
  content: string
): Promise<CommentWithUser> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      map_id: mapId,
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
    handleSupabaseError('addMapComment', error);
  }

  // comments_countはトリガーで自動更新される

  return mapCommentWithReplyTo(data);
}

/**
 * マップのコメント数を取得（トップレベルのみ）
 */
export async function getMapCommentsCount(mapId: string): Promise<number> {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('map_id', mapId)
    .is('parent_id', null);

  if (error) {
    handleSupabaseError('getMapCommentsCount', error);
  }

  return count ?? 0;
}
