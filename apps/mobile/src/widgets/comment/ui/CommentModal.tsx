/**
 * コメントモーダル
 *
 * コメント一覧をボトムシート形式で表示（Instagram風ハーフモーダル）
 * スポット/マップのコメント表示に使用
 * Modalでラップして画面全体をカバー（タブバーやヘッダーもグレーアウト）
 */

import React, { useCallback, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Keyboard,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetFooter } from '@gorhom/bottom-sheet';
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
      {/* 返信を表示/非表示トグル */}
      {hasReplies && !expanded && (
        <Pressable onPress={() => setExpanded(true)} className="py-2">
          <Text className="text-sm text-primary font-medium">
            {t('comment.showReplies', { count: replies.length })}
          </Text>
        </Pressable>
      )}

      {/* 返信一覧 */}
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

      {/* 返信を非表示 */}
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
  const isDarkMode = useIsDarkMode();
  const inputRef = useRef<CommentInputRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // スナップポイント: 60%と90%
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

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

  // フッター（入力エリア）レンダラー
  const renderFooter = useCallback(
    (props: React.ComponentProps<typeof BottomSheetFooter>) => (
      <BottomSheetFooter {...props} bottomInset={insets.bottom}>
        <View
          style={{
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
          }}
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
      </BottomSheetFooter>
    ),
    [insets.bottom, isDarkMode, currentUser?.avatar_url, inputText, setInputText, handleSubmit, isSubmitting, replyTarget, cancelReply]
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
        {/* 返信セクション */}
        {item.replies_count > 0 && (
          <RepliesSection
            parentId={item.id}
            currentUserId={currentUserId}
            onUserPress={handleUserPressInternal}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirm}
            onLike={handleLike}
          />
        )}
      </View>
    ),
    [currentUserId, handleUserPressInternal, handleEdit, handleDeleteConfirm, handleLike, handleReply]
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
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          footerComponent={renderFooter}
          handleIndicatorStyle={{ backgroundColor: colors.gray[400] }}
          backgroundStyle={{
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
          }}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
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
          <BottomSheetFlatList
            data={comments || []}
            keyExtractor={(item: CommentWithUser) => item.id}
            renderItem={renderCommentItem}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
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
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
