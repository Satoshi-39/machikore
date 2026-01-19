/**
 * useCommentActions
 *
 * コメント操作（編集・削除・いいね・返信）のロジックを共通化するフック
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  useUpdateComment,
  useDeleteComment,
  useLikeComment,
  useUnlikeComment,
} from '@/entities/comment';
import { showLoginRequiredAlert } from '@/shared/lib';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface UseCommentActionsOptions {
  /** スポットID（スポットコメント用） - 将来の拡張用 */
  spotId?: string | null;
  /** マップID（マップコメント用） - 将来の拡張用 */
  mapId?: string | null;
  /** 現在のユーザーID */
  currentUserId?: string | null;
}

export function useCommentActions({
  spotId: _spotId,
  mapId: _mapId,
  currentUserId,
}: UseCommentActionsOptions) {
  // spotId, mapIdは将来の拡張用（現在はコメント自体のspot_id/map_idを使用）
  void _spotId;
  void _mapId;
  // 編集中のコメント
  const [editingComment, setEditingComment] = useState<CommentWithUser | null>(null);
  const [editText, setEditText] = useState('');

  // 返信先のコメント
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // コメント入力モーダルの表示状態
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);

  // Mutations
  const { mutate: updateComment, isPending: isUpdatingComment } = useUpdateComment();
  const { mutate: deleteComment, isPending: isDeletingComment } = useDeleteComment();
  const { mutate: likeComment, isPending: isLikingComment } = useLikeComment();
  const { mutate: unlikeComment, isPending: isUnlikingComment } = useUnlikeComment();

  // 新規コメント追加モーダルを開く
  const handleAddComment = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('コメント');
      return;
    }
    setReplyingTo(null);
    setIsInputModalVisible(true);
  }, [currentUserId]);

  // コメント編集を開始
  const handleEdit = useCallback((comment: CommentWithUser) => {
    setEditingComment(comment);
    setEditText(comment.content);
  }, []);

  // コメント編集を送信
  const handleEditSubmit = useCallback(() => {
    if (!editingComment || !editText.trim() || isUpdatingComment) return;

    updateComment(
      {
        commentId: editingComment.id,
        content: editText.trim(),
        spotId: editingComment.user_spot_id,
        mapId: editingComment.map_id,
        parentId: editingComment.parent_id,
      },
      {
        onSuccess: () => {
          setEditingComment(null);
          setEditText('');
        },
      }
    );
  }, [editingComment, editText, isUpdatingComment, updateComment]);

  // コメント編集をキャンセル
  const handleEditCancel = useCallback(() => {
    setEditingComment(null);
    setEditText('');
  }, []);

  // コメント削除（確認ダイアログ付き）
  const handleDelete = useCallback((comment: CommentWithUser) => {
    Alert.alert(
      'コメントを削除',
      'このコメントを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            deleteComment({
              commentId: comment.id,
              spotId: comment.user_spot_id,
              mapId: comment.map_id,
              parentId: comment.parent_id,
            });
          },
        },
      ]
    );
  }, [deleteComment]);

  // コメント削除（確認なし - CommentListで確認済みの場合用）
  const handleDeleteConfirm = useCallback((comment: CommentWithUser) => {
    deleteComment({
      commentId: comment.id,
      spotId: comment.user_spot_id,
      mapId: comment.map_id,
      parentId: comment.parent_id,
    });
  }, [deleteComment]);

  // いいねトグル
  const handleLike = useCallback((comment: CommentWithUser) => {
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    // 返信コメントの場合はroot_idまたはparent_idを渡す（返信一覧の楽観的更新用）
    const parentId = comment.parent_id ? (comment.root_id || comment.parent_id) : null;

    if (comment.is_liked) {
      unlikeComment({
        userId: currentUserId,
        commentId: comment.id,
        spotId: comment.user_spot_id,
        mapId: comment.map_id,
        parentId,
      });
    } else {
      likeComment({
        userId: currentUserId,
        commentId: comment.id,
        spotId: comment.user_spot_id,
        mapId: comment.map_id,
        parentId,
      });
    }
  }, [currentUserId, likeComment, unlikeComment]);

  // 返信を開始
  const handleReply = useCallback((comment: CommentWithUser) => {
    if (!currentUserId) {
      showLoginRequiredAlert('返信');
      return;
    }
    setReplyingTo(comment);
    setIsInputModalVisible(true);
  }, [currentUserId]);

  // コメント入力モーダルを閉じる
  const closeInputModal = useCallback(() => {
    setIsInputModalVisible(false);
    setReplyingTo(null);
  }, []);

  return {
    // 状態
    editingComment,
    editText,
    replyingTo,
    isInputModalVisible,

    // 状態更新
    setEditText,
    setReplyingTo,
    setIsInputModalVisible,
    closeInputModal,

    // アクション
    handleAddComment,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
    handleDelete,
    handleDeleteConfirm,
    handleLike,
    handleReply,

    // 読み込み状態
    isUpdatingComment,
    isDeletingComment,
    isLikingComment,
    isUnlikingComment,
  };
}
