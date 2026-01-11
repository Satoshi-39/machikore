/**
 * コメント関連のヘルパー関数
 */

import type { CommentWithUser } from './types';

/**
 * コメントデータを型に変換
 */
export function mapComment(comment: any, currentUserId?: string | null): CommentWithUser {
  const isLiked = currentUserId
    ? (comment.comment_likes || []).some((like: any) => like.user_id === currentUserId)
    : false;

  return {
    id: comment.id,
    user_id: comment.user_id,
    map_id: comment.map_id,
    user_spot_id: comment.user_spot_id,
    content: comment.content,
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    parent_id: comment.parent_id || null,
    root_id: comment.root_id || null,
    depth: comment.depth || 0,
    likes_count: comment.likes_count || 0,
    replies_count: comment.replies_count || 0,
    user: comment.users || comment.user || null,
    reply_to_user: comment.reply_to_user || null,
    is_liked: isLiked,
  };
}
