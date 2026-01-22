/**
 * コメントモーダルSheet
 *
 * コメント一覧を表示するBottomSheet Widget
 * Instagram風の入力欄アニメーション付き
 *
 * - ビジネスロジック・状態管理: useCommentModalState (model層)
 * - アニメーション・UI: このコンポーネント
 */

import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Keyboard,
  ActivityIndicator,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedReaction, interpolate, Extrapolation, runOnJS } from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { CommentInput, CommentInputModal, type CommentInputRef } from '@/shared/ui';
import { CommentItem } from '@/entities/comment';
import { RepliesLink, ReplyDetailView, SlideContainer } from '@/widgets/comment';
import type { CommentWithUser } from '@/shared/api/supabase/comments';
import { useCommentModalState } from '../model';

interface CommentModalSheetProps {
  type: 'spot' | 'map';
  targetId: string;
  onClose: () => void;
  /** 開いた時に自動でキーボードを表示 */
  autoFocus?: boolean;
  /** 特定のコメントの返信詳細を開く */
  focusCommentId?: string;
}

export function CommentModalSheet({
  type,
  targetId,
  onClose,
  autoFocus = false,
  focusCommentId,
}: CommentModalSheetProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const { height: windowHeight } = useWindowDimensions();

  // Refs
  const inputRef = useRef<CommentInputRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 状態管理・ビジネスロジック（model層から取得）
  const {
    inputText,
    setInputText,
    replyTarget,
    focusedParentComment,
    currentUserId,
    currentUser,
    comments,
    isLoadingComments,
    authorId,
    author,
    isSubmitting,
    editingComment,
    editText,
    setEditText,
    handleEditSubmit,
    handleEditCancel,
    isUpdatingComment,
    handleSubmit,
    handleReply: handleReplyBase,
    cancelReply,
    handleEdit,
    handleDelete,
    handleLike,
    handleShowReplies,
    handleBackFromReplies,
    resetState,
    setPendingUserPress,
    handleSheetClose,
  } = useCommentModalState({
    type,
    targetId,
    onClose,
    focusCommentId,
  });

  // スナップポイント: 75%のみ
  const snapPoints = useMemo(() => ['75%'], []);

  // === アニメーション関連（UI層で管理） ===

  // 入力欄の実際の高さ（onLayoutで取得）
  const inputAreaHeight = useSharedValue(70 + insets.bottom);

  // BottomSheetの位置を追跡するためのSharedValue
  const animatedPosition = useSharedValue(0);

  // キーボードの高さを取得してアニメーション（react-native-keyboard-controller使用）
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  // 入力欄のonLayoutハンドラー
  const handleInputLayout = useCallback((event: LayoutChangeEvent) => {
    inputAreaHeight.value = event.nativeEvent.layout.height + insets.bottom;
  }, [inputAreaHeight, insets.bottom]);

  // シートが開いている時の上端位置（画面上端からの距離）
  const sheetOpenPosition = windowHeight * 0.25;

  // キーボードを閉じる関数（runOnJSで呼び出し用）
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // シートがドラッグされ始めたらキーボードを閉じる
  useAnimatedReaction(
    () => animatedPosition.value,
    (currentPosition, previousPosition) => {
      if (previousPosition === null) return;

      const threshold = sheetOpenPosition;
      const wasAtOpenPosition = previousPosition <= threshold;
      const isNowDragging = currentPosition > threshold;

      if (wasAtOpenPosition && isNowDragging) {
        runOnJS(dismissKeyboard)();
      }
    },
    [sheetOpenPosition, dismissKeyboard]
  );

  // Instagram風のアニメーション
  const inputAnimatedStyle = useAnimatedStyle(() => {
    const kbHeight = keyboardHeight.value;
    const currentInputHeight = inputAreaHeight.value;

    const sheetTranslateY = interpolate(
      animatedPosition.value,
      [sheetOpenPosition, windowHeight],
      [0, windowHeight - sheetOpenPosition],
      Extrapolation.CLAMP
    );

    const fadeStartPosition = windowHeight - currentInputHeight;
    const fadeEndPosition = windowHeight;

    const opacity = interpolate(
      animatedPosition.value,
      [fadeStartPosition, fadeEndPosition],
      [1, 0],
      Extrapolation.CLAMP
    );

    if (kbHeight < 0) {
      return {
        opacity: 1,
        transform: [{ translateY: kbHeight }],
        paddingBottom: 0,
      };
    }

    return {
      opacity,
      transform: [{ translateY: sheetTranslateY }],
      paddingBottom: insets.bottom,
    };
  });

  // autoFocusが指定されている場合、モーダル表示後にフォーカス
  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // === イベントハンドラー ===

  // 返信ハンドラー（フォーカス付き）
  const handleReply = useCallback((comment: CommentWithUser) => {
    handleReplyBase(comment);
    inputRef.current?.focus();
  }, [handleReplyBase]);

  // モーダルを閉じる
  const handleClose = useCallback(() => {
    resetState();
    bottomSheetRef.current?.close();
  }, [resetState]);

  // ユーザータップ時：閉じてから遷移
  const handleUserPress = useCallback((userId: string) => {
    setPendingUserPress(userId);
    bottomSheetRef.current?.close();
  }, [setPendingUserPress]);

  // BottomSheetのアニメーション開始ハンドラー
  const handleAnimate = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex < fromIndex || toIndex === -1) {
      Keyboard.dismiss();
    }
  }, []);

  // BottomSheetの変更ハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      handleSheetClose();
    }
  }, [handleSheetClose]);

  // === レンダー関数 ===

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

  const renderCommentItem = useCallback(
    ({ item }: { item: CommentWithUser }) => (
      <View>
        <CommentItem
          comment={item}
          currentUserId={currentUserId}
          onUserPress={handleUserPress}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item)}
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
    [currentUserId, handleUserPress, handleEdit, handleDelete, handleLike, handleReply, handleShowReplies]
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View className="flex-1 items-center justify-center py-12">
        {isLoadingComments ? (
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        ) : (
          <>
            <Ionicons name="chatbubble-outline" size={48} color={colors.gray[300]} />
            <Text className="mt-4 text-foreground-muted dark:text-dark-foreground-muted">
              {t('comment.noComments')}
            </Text>
          </>
        )}
      </View>
    ),
    [t, isLoadingComments]
  );

  return (
    <View className="flex-1 bg-transparent">
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onAnimate={handleAnimate}
        animatedPosition={animatedPosition}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.gray[400] }}
        backgroundStyle={{
          backgroundColor: isDarkMode ? colors.dark.surfaceSecondary : colors.light.surface,
        }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        enableBlurKeyboardOnGesture
      >
        {/* ヘッダー */}
        <View className="flex-row items-center px-4 pb-3 border-b border-border dark:border-dark-border">
          <View className="w-8 h-8 items-center justify-center">
            {focusedParentComment && (
              <Pressable
                onPress={handleBackFromReplies}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="chevron-back" size={24} color={isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary} />
              </Pressable>
            )}
          </View>
          <Text className="flex-1 text-center text-lg font-semibold text-foreground dark:text-dark-foreground">
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
                authorId={authorId}
                author={author}
                onUserPress={handleUserPress}
                onEdit={handleEdit}
                onDelete={handleDelete}
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

      {/* 入力エリア */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-surface dark:bg-dark-surface-secondary"
        style={inputAnimatedStyle}
        onLayout={handleInputLayout}
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
