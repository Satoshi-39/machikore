/**
 * コメントモーダル画面
 *
 * Expo Routerのtransparent modal用のラッパー
 * 下からスライドするボトムシートとしてコメント一覧を表示
 */

import React, { useCallback, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Keyboard,
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
import { CommentItem, useCommentReplies } from '@/entities/comment';
import {
  useSpotComments,
  useMapComments,
  useAddSpotComment,
  useAddMapComment,
  useAddReplyComment,
} from '@/entities/comment';
import { useUser, useCurrentUserId } from '@/entities/user';
import { useCommentActions } from '@/features/comment-actions';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface CommentModalScreenProps {
  type: 'spot' | 'map';
  targetId: string;
  onClose: () => void;
  onUserPress: (userId: string) => void;
}

/**
 * 返信表示コンポーネント（展開可能）
 */
function RepliesSection({
  parentId,
  currentUserId,
  onUserPress,
  onEdit,
  onDelete,
  onLike,
}: {
  parentId: string;
  currentUserId?: string | null;
  onUserPress: (userId: string) => void;
  onEdit: (comment: CommentWithUser) => void;
  onDelete: (comment: CommentWithUser) => void;
  onLike: (comment: CommentWithUser) => void;
}) {
  const { t } = useI18n();
  const { data: replies } = useCommentReplies(parentId, currentUserId);
  const [expanded, setExpanded] = useState(false);

  if (!replies || replies.length === 0) return null;

  const visibleReplies = expanded ? replies : [];
  const hasReplies = replies.length > 0;

  return (
    <View className="pl-12">
      {hasReplies && !expanded && (
        <Pressable onPress={() => setExpanded(true)} className="py-2">
          <Text className="text-sm text-primary font-medium">
            {t('comment.showReplies', { count: replies.length })}
          </Text>
        </Pressable>
      )}

      {visibleReplies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          currentUserId={currentUserId}
          onUserPress={onUserPress}
          onEdit={() => onEdit(reply)}
          onDelete={() => onDelete(reply)}
          onLike={() => onLike(reply)}
          isReply
        />
      ))}

      {expanded && (
        <Pressable onPress={() => setExpanded(false)} className="py-2">
          <Text className="text-sm text-primary font-medium">
            {t('comment.hideReplies')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export function CommentModalScreen({
  type,
  targetId,
  onClose,
  onUserPress,
}: CommentModalScreenProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const inputRef = useRef<CommentInputRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentUserId = useCurrentUserId();

  // 入力欄の高さ（CommentInput + safeArea）
  const inputAreaHeight = 70 + insets.bottom;

  // スナップポイント: 75%のみ
  const snapPoints = useMemo(() => ['75%'], []);

  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // ユーザータップ時の遷移用（アニメーション完了後に遷移）
  const pendingUserPressRef = useRef<string | null>(null);

  // 現在のユーザー情報
  const { data: currentUser } = useUser(currentUserId ?? null);

  // データ取得
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

  // モーダルを閉じる
  const handleClose = useCallback(() => {
    setInputText('');
    setReplyingTo(null);
    bottomSheetRef.current?.close();
  }, []);

  // ユーザータップ時：スライドで閉じてから遷移
  const handleUserPressWithAnimation = useCallback((userId: string) => {
    pendingUserPressRef.current = userId;
    bottomSheetRef.current?.close();
  }, []);

  // BottomSheetの変更ハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setInputText('');
      setReplyingTo(null);
      // ユーザータップ待ちがあれば遷移
      if (pendingUserPressRef.current) {
        const userId = pendingUserPressRef.current;
        pendingUserPressRef.current = null;
        onUserPress(userId);
      } else {
        onClose();
      }
    }
  }, [onClose, onUserPress]);

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
          onUserPress={handleUserPressWithAnimation}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDeleteConfirm(item)}
          onLike={() => handleLike(item)}
          onReply={() => handleReply(item)}
        />
        {item.replies_count > 0 && (
          <RepliesSection
            parentId={item.id}
            currentUserId={currentUserId}
            onUserPress={handleUserPressWithAnimation}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirm}
            onLike={handleLike}
          />
        )}
      </View>
    ),
    [currentUserId, handleUserPressWithAnimation, handleEdit, handleDeleteConfirm, handleLike, handleReply]
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
    <GestureHandlerRootView className="flex-1 bg-transparent">
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
        <View className="flex-row items-center justify-between px-4 pb-3 border-b border-border dark:border-dark-border">
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

        {/* コメント一覧 */}
        <FlatList
          data={comments || []}
          keyExtractor={(item: CommentWithUser) => item.id}
          renderItem={renderCommentItem}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

      {/* 入力エリア */}
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
  );
}
