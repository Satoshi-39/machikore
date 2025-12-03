/**
 * スポットコメント詳細ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Widgetの組み合わせのみ
 * X/note風：下部固定の入力欄、モーダルなしで直接入力
 */

import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotComments, useAddSpotComment, useAddReplyComment } from '@/entities/comment';
import { useCurrentUserId, useUser } from '@/entities/user';
import { useSpotWithDetails, SpotCard } from '@/entities/user-spot';
import { useCommentActions } from '@/features/comment-actions';
import { CommentList } from '@/widgets/comment-list';
import { PageHeader, CommentInput, CommentInputModal, type CommentInputRef } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useCurrentTab, showLoginRequiredAlert } from '@/shared/lib';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface SpotCommentsPageProps {
  spotId: string;
}

export function SpotCommentsPage({ spotId }: SpotCommentsPageProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const inputRef = useRef<CommentInputRef>(null);

  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // 現在のユーザー情報
  const { data: currentUser } = useUser(currentUserId ?? null);

  // データ取得
  const { data: spot, isLoading: isLoadingSpot } = useSpotWithDetails(spotId, currentUserId);
  const { data: comments, isLoading: isLoadingComments, refetch } = useSpotComments(spotId, 50, 0, currentUserId);

  const isLoading = isLoadingSpot || isLoadingComments;

  // コメント投稿
  const { mutate: addComment, isPending: isAddingComment } = useAddSpotComment();
  const { mutate: addReply, isPending: isAddingReply } = useAddReplyComment();
  const isSubmitting = isAddingComment || isAddingReply;

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
  } = useCommentActions({ spotId, currentUserId });

  // 返信ハンドラー（CommentInputのrefを使ってフォーカス）
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
      showLoginRequiredAlert(replyingTo ? '返信' : 'コメント');
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
    } else {
      addComment(
        { userId: currentUserId, spotId, content },
        { onSuccess }
      );
    }
  }, [currentUserId, inputText, replyingTo, spotId, addReply, addComment, isSubmitting]);

  // ナビゲーションハンドラー
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  const handleSpotPress = useCallback(() => {
    router.push(`/(tabs)/${currentTab}/spots/${spotId}`);
  }, [router, spotId, currentTab]);

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}`);
  }, [router, currentTab]);

  const handleSpotEdit = useCallback((id: string) => {
    router.push(`/edit-spot/${id}` as Href);
  }, [router]);

  // スポットヘッダー
  const renderSpotHeader = useCallback(() => {
    if (!spot) return null;
    return (
      <View>
        <SpotCard
          spot={spot}
          currentUserId={currentUserId}
          onPress={handleSpotPress}
          onUserPress={handleUserPress}
          onMapPress={handleMapPress}
          onEdit={handleSpotEdit}
          embeddedUser={spot.user}
          embeddedMasterSpot={spot.master_spot}
        />
        <View className="px-4 py-2 bg-background-secondary dark:bg-dark-background-secondary border-b border-border dark:border-dark-border">
          <Text className="text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">コメント</Text>
        </View>
      </View>
    );
  }, [spot, currentUserId, handleSpotPress, handleUserPress, handleMapPress, handleSpotEdit]);

  // 返信先の表示名を取得
  const replyTarget = replyingTo
    ? { displayName: replyingTo.user?.display_name || replyingTo.user?.username || '' }
    : null;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title="コメント" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
      <PageHeader title="コメント" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* コメント一覧 */}
        <CommentList
          comments={comments || []}
          currentUserId={currentUserId}
          onUserPress={handleUserPress}
          onEdit={handleEdit}
          onDeleteConfirm={handleDeleteConfirm}
          onLike={handleLike}
          onReply={handleReply}
          onRefresh={refetch}
          isRefreshing={isLoading}
          ListHeaderComponent={renderSpotHeader}
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
    </SafeAreaView>
  );
}
