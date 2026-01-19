/**
 * マップコメント関連API
 */

import { supabase, handleSupabaseError } from '../client';
import { COMMENTS_PAGE_SIZE } from '@/shared/config';
import type { CommentWithUser } from '@/shared/types';
import { mapComment, type MapCommentOptions } from './types';

/**
 * マップのコメント一覧を取得（トップレベルのみ、cursor-based pagination）
 * @param mapId マップID
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より古いものを取得）
 * @param options マッピングオプション（currentUserId, authorId, author）
 */
export async function getMapComments(
  mapId: string,
  limit: number = COMMENTS_PAGE_SIZE,
  cursor?: string,
  options?: MapCommentOptions
): Promise<CommentWithUser[]> {
  let query = supabase
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
    .limit(limit);

  // cursorが指定されている場合、その時刻より古いものを取得
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getMapComments', error);
  }

  return (data || []).map((comment) => mapComment(comment, options));
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
      ),
      comment_likes (
        user_id
      )
    `)
    .single();

  if (error) {
    handleSupabaseError('addMapComment', error);
  }

  // comments_countはトリガーで自動更新される

  return mapComment(data);
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
