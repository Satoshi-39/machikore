/**
 * コメントモーダルの状態管理フック
 *
 * ビジネスロジックと状態管理を担当
 * UIコンポーネントはアニメーション関連のみ管理
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import {
  useSpotComments,
  useMapComments,
  useAddSpotComment,
  useAddMapComment,
  useAddReplyComment,
} from '@/entities/comment';
import { useUser, useCurrentUserId } from '@/entities/user';
import { useSpotWithDetails } from '@/entities/user-spot';
import { useMap } from '@/entities/map';
import { useCommentActions } from '@/features/comment-actions';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface UseCommentModalStateProps {
  type: 'spot' | 'map';
  targetId: string;
  enabled?: boolean;
  focusCommentId?: string;
}

export function useCommentModalState({
  type,
  targetId,
  enabled = true,
  focusCommentId,
}: UseCommentModalStateProps) {
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();

  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // 返信詳細モード（親コメントを表示）
  const [focusedParentComment, setFocusedParentComment] = useState<CommentWithUser | null>(null);

  // focusCommentIdによる自動遷移を無効化するフラグ（手動で戻った場合）
  const hasManuallyClosedRef = useRef(false);

  // 現在のユーザー情報
  const { data: currentUser } = useUser(currentUserId ?? null);

  // 投稿者情報を取得（投稿者いいね表示用）
  const { data: spotData } = useSpotWithDetails(
    enabled && type === 'spot' ? targetId : null,
    currentUserId
  );
  const { data: mapData } = useMap(
    enabled && type === 'map' ? targetId : null,
    currentUserId
  );
  const authorId = type === 'spot' ? spotData?.user_id : mapData?.user_id;
  const author = type === 'spot' ? spotData?.user : mapData?.user;

  // データ取得
  const spotCommentsQuery = useSpotComments(
    enabled && type === 'spot' ? targetId : null,
    { currentUserId, authorId, author }
  );
  const mapCommentsQuery = useMapComments(
    enabled && type === 'map' ? targetId : null,
    { currentUserId, authorId, author }
  );

  const commentsQuery = type === 'spot' ? spotCommentsQuery : mapCommentsQuery;
  const comments = commentsQuery.data?.pages.flat() ?? [];
  const isLoadingComments = commentsQuery.isLoading;

  // コメント投稿
  const { mutate: addSpotComment, isPending: isAddingSpotComment } = useAddSpotComment();
  const { mutate: addMapComment, isPending: isAddingMapComment } = useAddMapComment();
  const { mutate: addReply, isPending: isAddingReply } = useAddReplyComment();
  const isSubmitting = isAddingSpotComment || isAddingMapComment || isAddingReply;

  // コメント操作フック
  const {
    editingComment,
    editText,
    setEditText,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
    handleDelete,
    handleLike,
    isUpdatingComment,
  } = useCommentActions(
    type === 'spot' ? { spotId: targetId, currentUserId } : { mapId: targetId, currentUserId }
  );

  // モーダルが閉じた時に状態をリセット
  useEffect(() => {
    if (!enabled) {
      setInputText('');
      setReplyingTo(null);
      setFocusedParentComment(null);
      hasManuallyClosedRef.current = false;
    }
  }, [enabled]);

  // focusCommentIdが指定されている場合、モーダルが開いてから返信詳細モードに遷移
  useEffect(() => {
    if (
      enabled &&
      focusCommentId &&
      comments &&
      comments.length > 0 &&
      !focusedParentComment &&
      !hasManuallyClosedRef.current
    ) {
      const targetComment = comments.find((c) => c.id === focusCommentId);
      if (targetComment) {
        const timer = setTimeout(() => {
          setFocusedParentComment(targetComment);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [enabled, focusCommentId, comments, focusedParentComment]);

  // 返信詳細モードへ遷移
  const handleShowReplies = useCallback((comment: CommentWithUser) => {
    setFocusedParentComment(comment);
  }, []);

  // 返信詳細モードから戻る
  const handleBackFromReplies = useCallback(() => {
    hasManuallyClosedRef.current = true;
    setFocusedParentComment(null);
  }, []);

  // 返信ハンドラー（inputRefのフォーカスはUI側で行う）
  const handleReply = useCallback((comment: CommentWithUser) => {
    setReplyingTo(comment);
  }, []);

  // 返信キャンセル
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // 送信ハンドラー
  const handleSubmit = useCallback(() => {
    const effectiveReplyTarget = replyingTo || focusedParentComment;

    if (!currentUserId) {
      showLoginRequiredAlert(effectiveReplyTarget ? t('comment.reply') : t('comment.comment'));
      return;
    }
    if (!inputText.trim() || isSubmitting) return;

    const content = inputText.trim();

    const onSuccess = () => {
      setInputText('');
      setReplyingTo(null);
      Keyboard.dismiss();
    };

    if (effectiveReplyTarget) {
      addReply(
        {
          userId: currentUserId,
          parentComment: effectiveReplyTarget,
          content,
          replyToUserId: replyingTo?.user_id,
        },
        { onSuccess }
      );
    } else if (type === 'spot') {
      addSpotComment(
        { userId: currentUserId, spotId: targetId, content },
        { onSuccess }
      );
    } else {
      addMapComment(
        { userId: currentUserId, mapId: targetId, content },
        { onSuccess }
      );
    }
  }, [currentUserId, inputText, replyingTo, focusedParentComment, type, targetId, addReply, addSpotComment, addMapComment, isSubmitting, t]);

  // 状態リセット
  const resetState = useCallback(() => {
    setInputText('');
    setReplyingTo(null);
    setFocusedParentComment(null);
  }, []);

  // 返信先の表示名を取得
  const replyTarget = replyingTo
    ? { displayName: replyingTo.user?.display_name || replyingTo.user?.username || '' }
    : null;

  return {
    // 状態
    inputText,
    setInputText,
    replyingTo,
    replyTarget,
    focusedParentComment,
    currentUserId,
    currentUser,

    // データ
    comments,
    isLoadingComments,
    authorId,
    author,

    // 送信状態
    isSubmitting,

    // 編集関連
    editingComment,
    editText,
    setEditText,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
    isUpdatingComment,

    // アクション
    handleSubmit,
    handleReply,
    cancelReply,
    handleDelete,
    handleLike,
    handleShowReplies,
    handleBackFromReplies,
    resetState,
  };
}
