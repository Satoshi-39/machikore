/**
 * スポット詳細カードのコメント入力管理フック
 */

import { useState, useCallback } from 'react';
import { Keyboard } from 'react-native';
import { useAddSpotComment, useAddReplyComment } from '@/entities/comment';
import { showLoginRequiredAlert } from '@/shared/lib';
import type { CommentWithUser } from '@/shared/api/supabase/comments';
import type { UUID } from '@/shared/types';

interface UseSpotCommentInputParams {
  spotId: string;
  currentUserId: UUID | null | undefined;
}

interface ReplyTarget {
  displayName: string;
}

interface UseSpotCommentInputReturn {
  /** コメントモーダルの表示状態 */
  isCommentModalVisible: boolean;
  /** 入力テキスト */
  inputText: string;
  /** 入力テキストを設定 */
  setInputText: (text: string) => void;
  /** 送信中かどうか */
  isSubmitting: boolean;
  /** 返信先の表示情報 */
  replyTarget: ReplyTarget | null;
  /** コメントモーダルを開く */
  openCommentModal: () => void;
  /** コメントモーダルを閉じる */
  closeCommentModal: () => void;
  /** 返信ハンドラー */
  handleReply: (comment: CommentWithUser) => void;
  /** 返信キャンセル */
  cancelReply: () => void;
  /** コメント送信 */
  handleCommentSubmit: () => void;
}

/**
 * スポット詳細カードのコメント入力を管理するフック
 */
export function useSpotCommentInput({
  spotId,
  currentUserId,
}: UseSpotCommentInputParams): UseSpotCommentInputReturn {
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // コメント投稿
  const { mutate: addComment, isPending: isAddingComment } = useAddSpotComment();
  const { mutate: addReply, isPending: isAddingReply } = useAddReplyComment();
  const isSubmitting = isAddingComment || isAddingReply;

  // コメントモーダルを開く
  const openCommentModal = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('コメント');
      return;
    }
    setIsCommentModalVisible(true);
  }, [currentUserId]);

  // コメントモーダルを閉じる
  const closeCommentModal = useCallback(() => {
    setIsCommentModalVisible(false);
    setReplyingTo(null);
  }, []);

  // 返信ハンドラー
  const handleReply = useCallback((comment: CommentWithUser) => {
    if (!currentUserId) {
      showLoginRequiredAlert('返信');
      return;
    }
    setReplyingTo(comment);
    setIsCommentModalVisible(true);
  }, [currentUserId]);

  // 返信キャンセル
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // コメント送信
  const handleCommentSubmit = useCallback(() => {
    if (!currentUserId || !inputText.trim() || isSubmitting) return;

    const content = inputText.trim();

    const onSuccess = () => {
      setInputText('');
      setReplyingTo(null);
      setIsCommentModalVisible(false);
      Keyboard.dismiss();
    };

    if (replyingTo) {
      addReply(
        { userId: currentUserId, parentComment: replyingTo, content },
        { onSuccess }
      );
    } else {
      addComment(
        { userId: currentUserId, spotId, content },
        { onSuccess }
      );
    }
  }, [currentUserId, inputText, replyingTo, spotId, addReply, addComment, isSubmitting]);

  // 返信先の表示名
  const replyTarget: ReplyTarget | null = replyingTo
    ? { displayName: replyingTo.user?.display_name || replyingTo.user?.username || '' }
    : null;

  return {
    isCommentModalVisible,
    inputText,
    setInputText,
    isSubmitting,
    replyTarget,
    openCommentModal,
    closeCommentModal,
    handleReply,
    cancelReply,
    handleCommentSubmit,
  };
}
