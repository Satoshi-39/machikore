/**
 * コメントモーダル
 *
 * コメント一覧をモーダル形式で表示
 * スポット/マップのコメント表示に使用
 */

import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { CommentInput, CommentInputModal, type CommentInputRef } from '@/shared/ui';
import { CommentList } from '@/widgets/comment-list';
import {
  useSpotComments,
  useMapComments,
  useAddSpotComment,
  useAddMapComment,
  useAddReplyComment,
} from '@/entities/comment';
import { useUser } from '@/entities/user';
import { useCommentActions } from '@/features/comment-actions';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  /** コメント対象のタイプ */
  type: 'spot' | 'map';
  /** コメント対象のID */
  targetId: string;
  currentUserId?: string | null;
  /** ユーザータップ時のコールバック */
  onUserPress?: (userId: string) => void;
}

export function CommentModal({
  visible,
  onClose,
  type,
  targetId,
  currentUserId,
  onUserPress,
}: CommentModalProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<CommentInputRef>(null);

  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // 現在のユーザー情報
  const { data: currentUser } = useUser(currentUserId ?? null);

  // データ取得（タイプに応じて切り替え）
  const { data: spotComments, refetch: refetchSpot } = useSpotComments(
    type === 'spot' ? targetId : '',
    50,
    0,
    currentUserId
  );
  const { data: mapComments, refetch: refetchMap } = useMapComments(
    type === 'map' ? targetId : '',
    50,
    0,
    currentUserId
  );

  const comments = type === 'spot' ? spotComments : mapComments;
  const refetch = type === 'spot' ? refetchSpot : refetchMap;

  // コメント投稿
  const { mutate: addSpotComment, isPending: isAddingSpotComment } = useAddSpotComment();
  const { mutate: addMapComment, isPending: isAddingMapComment } = useAddMapComment();
  const { mutate: addReply, isPending: isAddingReply } = useAddReplyComment();
  const isSubmitting = isAddingSpotComment || isAddingMapComment || isAddingReply;

  // コメント操作フック（編集・削除・いいね用）
  const {
    editingComment,
    editText,
    setEditText,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
    handleDeleteConfirm,
    handleLike,
    isUpdatingComment,
  } = useCommentActions(
    type === 'spot' ? { spotId: targetId, currentUserId } : { mapId: targetId, currentUserId }
  );

  // 返信ハンドラー
  const handleReply = useCallback((comment: CommentWithUser) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  }, []);

  // 返信キャンセル
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // 送信ハンドラー
  const handleSubmit = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert(replyingTo ? t('comment.reply') : t('comment.comment'));
      return;
    }
    if (!inputText.trim() || isSubmitting) return;

    const content = inputText.trim();

    const onSuccess = () => {
      setInputText('');
      setReplyingTo(null);
      Keyboard.dismiss();
    };

    if (replyingTo) {
      addReply(
        { userId: currentUserId, parentComment: replyingTo, content },
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
  }, [currentUserId, inputText, replyingTo, type, targetId, addReply, addSpotComment, addMapComment, isSubmitting, t]);

  // ユーザープレスハンドラー
  const handleUserPressInternal = useCallback((userId: string) => {
    onUserPress?.(userId);
  }, [onUserPress]);

  // モーダルを閉じる際に状態をリセット
  const handleClose = useCallback(() => {
    setInputText('');
    setReplyingTo(null);
    onClose();
  }, [onClose]);

  // 返信先の表示名を取得
  const replyTarget = replyingTo
    ? { displayName: replyingTo.user?.display_name || replyingTo.user?.username || '' }
    : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View
        className="flex-1 bg-surface dark:bg-dark-surface"
        style={{ paddingTop: insets.top }}
      >
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border dark:border-dark-border">
          <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
            {t('comment.comments')}
          </Text>
          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-8 h-8 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={0}
        >
          {/* コメント一覧 */}
          <CommentList
            comments={comments || []}
            currentUserId={currentUserId}
            onUserPress={handleUserPressInternal}
            onEdit={handleEdit}
            onDeleteConfirm={handleDeleteConfirm}
            onLike={handleLike}
            onReply={handleReply}
            onRefresh={refetch}
          />

          {/* 下部固定の入力エリア */}
          <CommentInput
            ref={inputRef}
            avatarUrl={currentUser?.avatar_url}
            inputText={inputText}
            onChangeText={setInputText}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            replyingTo={replyTarget}
            onCancelReply={cancelReply}
            variant="fixed"
          />
        </KeyboardAvoidingView>

        {/* 編集モーダル */}
        <CommentInputModal
          visible={!!editingComment}
          onClose={handleEditCancel}
          avatarUrl={currentUser?.avatar_url}
          inputText={editText}
          onChangeText={setEditText}
          onSubmit={handleEditSubmit}
          isSubmitting={isUpdatingComment}
          isEditing
        />
      </View>
    </Modal>
  );
}
