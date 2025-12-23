/**
 * Supabase Comments API
 * コメント機能（スポット・マップ）
 */

import { supabase, handleSupabaseError } from './client';
import { log } from '@/shared/config/logger';

// ===============================
// 型定義
// ===============================

export interface CommentUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
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
  // いいね状態（ログインユーザー用）
  is_liked?: boolean;
  // 返信一覧（オプション）
  replies?: CommentWithUser[];
}

// ===============================
// ヘルパー関数
// ===============================

/**
 * コメントデータを型に変換
 */
function mapComment(comment: any, currentUserId?: string | null): CommentWithUser {
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
    user: comment.users || null,
    is_liked: isLiked,
  };
}

// ===============================
// スポットコメント
// ===============================

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
      users (
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
      users (
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
 * コメントを更新
 */
export async function updateComment(commentId: string, content: string): Promise<CommentWithUser> {
  const { data, error } = await supabase
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
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

// ===============================
// マップコメント
// ===============================

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
      users (
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

  return (data || []).map((comment: any) => mapComment(comment, currentUserId));
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
      users (
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

// ===============================
// コメントいいね
// ===============================

/**
 * コメントにいいねを追加
 */
export async function likeComment(userId: string, commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comment_likes')
    .insert({ user_id: userId, comment_id: commentId });

  if (error) {
    // 重複エラーは無視（既にいいね済み）
    if (error.code === '23505') return;
    handleSupabaseError('likeComment', error);
  }
}

/**
 * コメントのいいねを取り消し
 */
export async function unlikeComment(userId: string, commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comment_likes')
    .delete()
    .eq('user_id', userId)
    .eq('comment_id', commentId);

  if (error) {
    handleSupabaseError('unlikeComment', error);
  }
}

/**
 * コメントのいいね状態を取得
 */
export async function isCommentLiked(userId: string, commentId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('comment_id', commentId)
    .maybeSingle();

  if (error) {
    log.error('[Comments] Error:', error);
    return false;
  }

  return !!data;
}

// ===============================
// 返信コメント
// ===============================

/**
 * コメントの返信一覧を取得
 */
export async function getCommentReplies(
  parentId: string,
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string | null
): Promise<CommentWithUser[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      users (
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

  return (data || []).map((comment: any) => mapComment(comment, currentUserId));
}

/**
 * コメントに返信を追加
 */
export async function addReplyComment(
  userId: string,
  parentComment: CommentWithUser,
  content: string
): Promise<CommentWithUser> {
  // root_idはトップレベルコメントのID（親がトップレベルなら親のID、そうでなければ親のroot_id）
  const rootId = parentComment.parent_id === null ? parentComment.id : parentComment.root_id;
  // 深さは親の深さ+1（ただし現在は1階層制限）
  const depth = Math.min(parentComment.depth + 1, 1);

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      user_spot_id: parentComment.user_spot_id,
      map_id: parentComment.map_id,
      parent_id: parentComment.id,
      root_id: rootId,
      depth,
      content,
    })
    .select(`
      *,
      users (
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

  return mapComment(data);
}
