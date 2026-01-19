/**
 * コメント関連の型定義とマッパー関数
 */

import type { CommentWithUser, UserBasicInfo } from '@/shared/types';

// CommentWithUserをre-export（利便性のため）
export type { CommentWithUser } from '@/shared/types';

export interface MapCommentOptions {
  currentUserId?: string | null;
  authorId?: string | null;
  author?: UserBasicInfo | null;
}

/**
 * Supabaseから取得したコメントデータをCommentWithUser型に変換
 */
export function mapComment(comment: any, options: MapCommentOptions = {}): CommentWithUser {
  const { currentUserId, authorId, author } = options;
  const likes = comment.comment_likes || [];

  const isLiked = currentUserId
    ? likes.some((like: any) => like.user_id === currentUserId)
    : false;

  const isLikedByAuthor = authorId
    ? likes.some((like: any) => like.user_id === authorId)
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
    is_liked_by_author: isLikedByAuthor,
    author: author || null,
  };
}
