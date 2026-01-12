/**
 * コメントモーダル
 *
 * コメント一覧をボトムシート形式で表示（Instagram風ハーフモーダル）
 * スポット/マップのコメント表示に使用
 * Modalでラップして画面全体をカバー（タブバーやヘッダーもグレーアウト）
 */

import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Keyboard,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { CommentInput, CommentInputModal, type CommentInputRef } from '@/shared/ui';
import { CommentItem } from '@/entities/comment';
import {
  useSpotComments,
  useMapComments,
  useAddSpotComment,
  useAddMapComment,
  useAddReplyComment,
} from '@/entities/comment';
import { useUser } from '@/entities/user';
import { useCommentActions } from '@/features/comment-actions';
import { RepliesLink } from './RepliesLink';
import { ReplyDetailView } from './ReplyDetailView';
import { SlideContainer } from './SlideContainer';
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
  /** 特定のコメントの返信詳細を開く */
  focusCommentId?: string | null;
}

export function CommentModal({
  visible,
  onClose,
  type,
  targetId,
  currentUserId,
  onUserPress,
  focusCommentId,
}: CommentModalProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const inputRef = useRef<CommentInputRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 入力欄の高さ（CommentInput + safeArea）
  const inputAreaHeight = 70 + insets.bottom;

  // スナップポイント: 75%のみ（複数スナップポイントでのスクロール問題を回避）
  const snapPoints = useMemo(() => ['75%'], []);


  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // 返信詳細モード（親コメントを表示）
  const [focusedParentComment, setFocusedParentComment] = useState<CommentWithUser | null>(null);

  // focusCommentIdによる自動遷移を無効化するフラグ（手動で戻った場合）
  const hasManuallyClosedRef = useRef(false);

  // モーダルが閉じられたときに状態をリセット
  useEffect(() => {
    if (!visible) {
      setFocusedParentComment(null);
      setReplyingTo(null);
      setInputText('');
      hasManuallyClosedRef.current = false;
    }
  }, [visible]);

  // 現在のユーザー情報
  const { data: currentUser } = useUser(currentUserId ?? null);

  // データ取得（タイプに応じて切り替え）
  const { data: spotComments } = useSpotComments(
    type === 'spot' ? targetId : '',
    50,
    0,
    currentUserId
  );
  const { data: mapComments } = useMapComments(
    type === 'map' ? targetId : '',
    50,
    0,
    currentUserId
  );

  const comments = type === 'spot' ? spotComments : mapComments;

  // focusCommentIdが指定されている場合、モーダルが開いてから返信詳細モードに遷移
  useEffect(() => {
    if (
      visible &&
      focusCommentId &&
      comments &&
      comments.length > 0 &&
      !focusedParentComment &&
      !hasManuallyClosedRef.current
    ) {
      const targetComment = comments.find((c) => c.id === focusCommentId);
      if (targetComment) {
        // モーダルが開くアニメーション後に遷移（一瞬コメント一覧が見える）
        const timer = setTimeout(() => {
          setFocusedParentComment(targetComment);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, focusCommentId, comments, focusedParentComment]);

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

  // 返信詳細モードへ遷移
  const handleShowReplies = useCallback((comment: CommentWithUser) => {
    setFocusedParentComment(comment);
  }, []);

  // 返信詳細モードから戻る
  const handleBackFromReplies = useCallback(() => {
    hasManuallyClosedRef.current = true; // 手動で戻ったことを記録
    setFocusedParentComment(null);
  }, []);

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
  // 返信詳細モード中は、replyingToがなくても親コメントへの返信として扱う
  const handleSubmit = useCallback(() => {
    // 返信詳細モード中かつreplyingToがない場合は、親コメントへの返信
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
      // replyingToがある場合のみ（明示的に返信ボタンを押した場合）replyToUserIdを指定
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

  // ユーザープレスハンドラー
  const handleUserPressInternal = useCallback((userId: string) => {
    onUserPress?.(userId);
  }, [onUserPress]);

  // モーダルを閉じる際に状態をリセット
  const handleClose = useCallback(() => {
    setInputText('');
    setReplyingTo(null);
    bottomSheetRef.current?.close();
  }, []);

  // BottomSheetの変更ハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setInputText('');
      setReplyingTo(null);
      onClose();
    }
  }, [onClose]);


  // 返信先の表示名を取得
  const replyTarget = replyingTo
    ? { displayName: replyingTo.user?.display_name || replyingTo.user?.username || '' }
    : null;

  // バックドロップレンダラー
  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );


  // コメントアイテムのレンダリング
  const renderCommentItem = useCallback(
    ({ item }: { item: CommentWithUser }) => (
      <View>
        <CommentItem
          comment={item}
          currentUserId={currentUserId}
          onUserPress={handleUserPressInternal}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDeleteConfirm(item)}
          onLike={() => handleLike(item)}
          onReply={() => handleReply(item)}
        />
        {/* 返信リンク */}
        {item.replies_count > 0 && (
          <RepliesLink
            comment={item}
            onShowReplies={handleShowReplies}
          />
        )}
      </View>
    ),
    [currentUserId, handleUserPressInternal, handleEdit, handleDeleteConfirm, handleLike, handleReply, handleShowReplies]
  );

  // 空の場合の表示
  const renderEmptyComponent = useCallback(
    () => (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="chatbubble-outline" size={48} color={colors.gray[300]} />
        <Text className="mt-4 text-foreground-muted dark:text-dark-foreground-muted">
          {t('comment.noComments')}
        </Text>
      </View>
    ),
    [t]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView className="flex-1">
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          enableDynamicSizing={false}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{ backgroundColor: colors.gray[400] }}
          backgroundStyle={{
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
          }}
          bottomInset={inputAreaHeight}
        >
          {/* ヘッダー */}
          <View className="flex-row items-center px-4 pb-3 border-b border-border dark:border-dark-border">
            {/* 左側：戻るボタン（または空スペース） */}
            <View className="w-8 h-8 items-center justify-center">
              {focusedParentComment && (
                <Pressable
                  onPress={handleBackFromReplies}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
                </Pressable>
              )}
            </View>
            {/* 中央：タイトル */}
            <Text className="flex-1 text-center text-lg font-semibold text-foreground dark:text-dark-foreground">
              {t('comment.comments')}
            </Text>
            {/* 右側：閉じるボタン */}
            <Pressable
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-8 h-8 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
            >
              <Ionicons name="close" size={20} color={colors.text.secondary} />
            </Pressable>
          </View>

          {/* コメント一覧 ⇔ 返信詳細（横スライド） */}
          <SlideContainer
            showDetail={!!focusedParentComment}
            mainView={
              <FlatList
                data={comments || []}
                keyExtractor={(item: CommentWithUser) => item.id}
                renderItem={renderCommentItem}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            }
            detailView={
              focusedParentComment ? (
                <ReplyDetailView
                  parentComment={focusedParentComment}
                  currentUserId={currentUserId}
                  onUserPress={handleUserPressInternal}
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                  onLike={handleLike}
                  onReply={handleReply}
                />
              ) : null
            }
          />

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
        </BottomSheet>

        {/* 入力エリア（画面下部に固定、シートの外側） */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="absolute bottom-0 left-0 right-0"
        >
          <View
            className="border-t border-border dark:border-dark-border bg-surface dark:bg-dark-surface"
            style={{ paddingBottom: insets.bottom }}
          >
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
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

