/**
 * コメント返信関連API
 */

import { supabase, handleSupabaseError } from '../client';
import { COMMENTS_PAGE_SIZE } from '@/shared/config';
import type { CommentWithUser } from '@/shared/types';
import { mapComment, type MapCommentOptions } from './types';

/**
 * コメントの返信一覧を取得（cursor-based pagination）
 * @param parentId 親コメントID
 * @param limit 取得件数
 * @param cursor ページネーション用カーソル（created_at、この値より新しいものを取得）
 * @param options マッピングオプション（currentUserId, authorId, author）
 */
export async function getCommentReplies(
  parentId: string,
  limit: number = COMMENTS_PAGE_SIZE,
  cursor?: string,
  options?: MapCommentOptions
): Promise<CommentWithUser[]> {
  // 返信コメントを取得（reply_to_userも含む）
  let query = supabase
    .from('comments')
    .select(`
      *,
      user:users!comments_user_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      reply_to_user:users!comments_reply_to_user_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      comment_likes (
        user_id
      )
    `)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true })
    .limit(limit);

  // cursorが指定されている場合、その時刻より新しいものを取得（昇順なので gt）
  if (cursor) {
    query = query.gt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getCommentReplies', error);
  }

  return (data || []).map((comment) => mapComment(comment, options));
}

/**
 * コメントに返信を追加（Instagram/Note方式）
 *
 * フラット表示のため、すべての返信はルートコメント直下に配置される
 * - parent_id: 常にルートコメントのID（replies_countのトリガー用）
 * - root_id: ルートコメントのID
 * - depth: 1（すべての返信は同じ深さ）
 * - reply_to_user_id: 返信先のユーザーID（誰への返信かを示す、オプション）
 *
 * @param replyToUserId 返信先のユーザーID（明示的に返信ボタンを押した場合のみ指定）
 */
export async function addReplyComment(
  userId: string,
  parentComment: CommentWithUser,
  content: string,
  replyToUserId?: string | null
): Promise<CommentWithUser> {
  // ルートコメントのIDを特定
  const rootId = parentComment.parent_id === null ? parentComment.id : parentComment.root_id;
  // フラット表示: parent_idは常にルートコメントID
  const actualParentId = rootId;

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      user_spot_id: parentComment.user_spot_id,
      map_id: parentComment.map_id,
      parent_id: actualParentId,
      root_id: rootId,
      depth: 1, // フラット表示: すべての返信は深さ1
      reply_to_user_id: replyToUserId,
      content,
    })
    .select(`
      *,
      user:users!comments_user_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      reply_to_user:users!comments_reply_to_user_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      comment_likes (
        user_id
      )
    `)
    .single();

  if (error) {
    handleSupabaseError('addReplyComment', error);
  }

  // 注意: 返信はスポット/マップのcomments_countには含めない
  // 親コメントのreplies_countはDBトリガーで自動更新される

  return mapComment(data);
}
