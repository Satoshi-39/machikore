/**
 * コメント返信関連API
 */

import { supabase, handleSupabaseError } from '../client';
import type { CommentWithUser, ReplyToComment } from './types';
import { mapComment, mapCommentWithReplyTo } from './helpers';

/**
 * コメントの返信一覧を取得
 */
export async function getCommentReplies(
  parentId: string,
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string | null
): Promise<CommentWithUser[]> {
  // 返信コメントを取得
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
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    handleSupabaseError('getCommentReplies', error);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // 返信先コメントIDを収集（重複除去）
  const replyToCommentIds = [...new Set(
    data
      .map((c: any) => c.reply_to_comment_id)
      .filter((id: string | null): id is string => id !== null)
  )];

  // 返信先コメントを別クエリで取得
  let replyToCommentsMap = new Map<string, ReplyToComment>();
  if (replyToCommentIds.length > 0) {
    const { data: replyToComments } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        user:users!comments_user_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .in('id', replyToCommentIds);

    if (replyToComments) {
      replyToComments.forEach((c: any) => {
        replyToCommentsMap.set(c.id, {
          id: c.id,
          content: c.content,
          user: c.user || null,
        });
      });
    }
  }

  // コメントデータをマッピング
  return data.map((comment: any) => {
    const mapped = mapCommentWithReplyTo(comment, currentUserId);
    if (comment.reply_to_comment_id) {
      mapped.reply_to_comment = replyToCommentsMap.get(comment.reply_to_comment_id) || null;
    }
    return mapped;
  });
}

/**
 * コメントに返信を追加（フラット表示対応）
 *
 * フラット表示のため、すべての返信はルートコメント直下に配置される
 * - parent_id: 常にルートコメントのID（replies_countのトリガー用）
 * - root_id: ルートコメントのID
 * - depth: 1（すべての返信は同じ深さ）
 * - reply_to_comment_id: 実際の返信先コメントのID（どのコメントへの返信かを追跡）
 */
export async function addReplyComment(
  userId: string,
  parentComment: CommentWithUser,
  content: string
): Promise<CommentWithUser> {
  // ルートコメントのIDを特定
  const rootId = parentComment.parent_id === null ? parentComment.id : parentComment.root_id;
  // フラット表示: parent_idは常にルートコメントID
  const actualParentId = rootId;
  // 返信先コメント情報を保持
  // トップレベルコメントへの返信の場合はnull（同じスレッドの開始なので不要）
  const replyToCommentId = parentComment.parent_id !== null ? parentComment.id : null;

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      user_spot_id: parentComment.user_spot_id,
      map_id: parentComment.map_id,
      parent_id: actualParentId,
      root_id: rootId,
      depth: 1, // フラット表示: すべての返信は深さ1
      reply_to_comment_id: replyToCommentId,
      content,
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
    handleSupabaseError('addReplyComment', error);
  }

  // 注意: 返信はスポット/マップのcomments_countには含めない
  // 親コメントのreplies_countはDBトリガーで自動更新される

  const result = mapComment(data);
  // 返信先コメント情報を追加（insert直後なのでparentCommentから取得）
  if (replyToCommentId) {
    result.reply_to_comment = {
      id: parentComment.id,
      content: parentComment.content,
      user: parentComment.user,
    };
  }
  return result;
}
