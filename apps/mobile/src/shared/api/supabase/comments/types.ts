/**
 * コメント関連の型定義
 */

export interface CommentUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

/** 返信先コメント情報（フラット表示用） */
export interface ReplyToComment {
  id: string;
  content: string;
  user: CommentUser | null;
}

export interface CommentWithUser {
  id: string;
  user_id: string;
  map_id: string | null;
  user_spot_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  // 返信機能用
  parent_id: string | null;
  root_id: string | null;
  depth: number;
  likes_count: number;
  replies_count: number;
  // リレーション
  user: CommentUser | null;
  // 返信先コメント情報（フラット表示用）
  reply_to_comment?: ReplyToComment | null;
  // いいね状態（ログインユーザー用）
  is_liked?: boolean;
  // 返信一覧（オプション）
  replies?: CommentWithUser[];
}
