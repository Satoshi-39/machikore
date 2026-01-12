/**
 * コメントモーダル画面
 *
 * Expo Routerのtransparent modal用のラッパー
 * 下からスライドするボトムシートとしてコメント一覧を表示
 */

import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { showLoginRequiredAlert, useCurrentTab } from '@/shared/lib';
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
import { useUser, useCurrentUserId } from '@/entities/user';
import { useCommentActions } from '@/features/comment-actions';
import { RepliesLink, ReplyDetailView, SlideContainer } from '@/widgets/comment';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface CommentModalScreenProps {
  type: 'spot' | 'map';
  targetId: string;
  onClose: () => void;
  /** 開いた時に自動でキーボードを表示 */
  autoFocus?: boolean;
  /** 特定のコメントの返信詳細を開く */
  focusCommentId?: string;
}

export function CommentModalPage({
  type,
  targetId,
  onClose,
  autoFocus = false,
  focusCommentId,
}: CommentModalScreenProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const inputRef = useRef<CommentInputRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentUserId = useCurrentUserId();

  // スナップポイント: 75%のみ
  const snapPoints = useMemo(() => ['75%'], []);

  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // 返信詳細モード（親コメントを表示）
  const [focusedParentComment, setFocusedParentComment] = useState<CommentWithUser | null>(null);

  // focusCommentIdによる自動遷移を無効化するフラグ（手動で戻った場合）
  const hasManuallyClosedRef = useRef(false);

  // ユーザータップ時の遷移用（アニメーション完了後に遷移）
  const pendingUserPressRef = useRef<string | null>(null);

  // 入力エリアの表示制御（閉じるアニメーション時に隠す）
  const inputOpacity = useSharedValue(1);
  const inputAnimatedStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
  }));

  // autoFocusが指定されている場合、モーダル表示後にフォーカス
  useEffect(() => {
    if (autoFocus) {
      // BottomSheetのアニメーション完了を待ってからフォーカス
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

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

  // focusCommentIdが指定されている場合、モーダルが開いてから返信詳細モードに遷移
  // 一瞬コメント一覧を見せてから遷移するため、遅延を入れる
  // 手動で戻った場合は再遷移しない
  useEffect(() => {
    if (
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
  }, [focusCommentId, comments, focusedParentComment]);

  // 返信詳細モードへ遷移
  const handleShowReplies = useCallback((comment: CommentWithUser) => {
    setFocusedParentComment(comment);
  }, []);

  // 返信詳細モードから戻る
  const handleBackFromReplies = useCallback(() => {
    hasManuallyClosedRef.current = true; // 手動で戻ったことを記録
    setFocusedParentComment(null);
  }, []);

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

  // モーダルを閉じる
  const handleClose = useCallback(() => {
    setInputText('');
    setReplyingTo(null);
    bottomSheetRef.current?.close();
  }, []);

  // ユーザータップ時：閉じてから遷移
  const handleUserPress = useCallback((userId: string) => {
    pendingUserPressRef.current = userId;
    bottomSheetRef.current?.close();
  }, []);

  // BottomSheetのアニメーション開始ハンドラー（閉じる時に入力エリアを隠す）
  const handleAnimate = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex === -1) {
      // 閉じるアニメーション開始時に入力エリアを即座に隠す
      inputOpacity.value = withTiming(0, { duration: 150 });
    } else if (fromIndex === -1) {
      // 開くアニメーション時に入力エリアを表示
      inputOpacity.value = withTiming(1, { duration: 150 });
    }
  }, [inputOpacity]);

  // BottomSheetの変更ハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setInputText('');
      setReplyingTo(null);
      // ユーザータップ待ちがあれば遷移
      if (pendingUserPressRef.current) {
        const userId = pendingUserPressRef.current;
        pendingUserPressRef.current = null;
        // モーダルを閉じてからプロフィールに遷移
        router.dismiss();
        router.push(`/(tabs)/${currentTab}/users/${userId}`);
      } else {
        onClose();
      }
    }
  }, [onClose, router, currentTab]);

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
          onUserPress={handleUserPress}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDeleteConfirm(item)}
          onLike={() => handleLike(item)}
          onReply={() => handleReply(item)}
        />
        {item.replies_count > 0 && (
          <RepliesLink
            comment={item}
            onShowReplies={handleShowReplies}
          />
        )}
      </View>
    ),
    [currentUserId, handleUserPress, handleEdit, handleDeleteConfirm, handleLike, handleReply, handleShowReplies]
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
    <View className="flex-1 bg-transparent">
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onAnimate={handleAnimate}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.gray[400] }}
        backgroundStyle={{
          backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
        }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
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
                <Ionicons name="chevron-back" size={24} color={isDarkMode ? colors.dark.foreground : colors.light.foreground} />
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
            <BottomSheetFlatList
              data={comments || []}
              keyExtractor={(item: CommentWithUser) => item.id}
              renderItem={renderCommentItem}
              ListEmptyComponent={renderEmptyComponent}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 + insets.bottom }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          }
          detailView={
            focusedParentComment ? (
              <ReplyDetailView
                parentComment={focusedParentComment}
                currentUserId={currentUserId}
                onUserPress={handleUserPress}
                onEdit={handleEdit}
                onDelete={handleDeleteConfirm}
                onLike={handleLike}
                onReply={handleReply}
                contentPaddingBottom={70 + insets.bottom}
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

      {/* 入力エリア（BottomSheetの外だが閉じる時に一緒にフェードアウト） */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 border-t border-border dark:border-dark-border bg-surface dark:bg-dark-surface"
        style={[{ paddingBottom: insets.bottom }, inputAnimatedStyle]}
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
      </Animated.View>
    </View>
  );
}
