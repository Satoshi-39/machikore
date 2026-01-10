/**
 * コメント関連API
 * すべてのコメント機能をここからエクスポート
 */

// 型定義
export type { CommentUser, ReplyToComment, CommentWithUser } from './types';

// ヘルパー関数
export { mapComment, mapCommentWithReplyTo } from './helpers';

// スポットコメント
export { getSpotComments, addSpotComment, getSpotCommentsCount } from './spot-comments';

// マップコメント
export { getMapComments, addMapComment, getMapCommentsCount } from './map-comments';

// コメントいいね
export { likeComment, unlikeComment, isCommentLiked } from './comment-likes';

// 返信コメント
export { getCommentReplies, addReplyComment } from './comment-replies';

// 共通操作（更新・削除）
export { updateComment, deleteComment } from './comment-common';
