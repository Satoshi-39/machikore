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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotComments, useAddSpotComment, useAddReplyComment } from '@/entities/comment';
import { useCurrentUserId, useUser } from '@/entities/user';
import { useSpotWithDetails, SpotCard } from '@/entities/user-spot';
import { useCommentActions } from '@/features/comment-actions';
import { useSpotActions } from '@/features/spot-actions';
import { CommentList } from '@/widgets/comment';
import { PageHeader, CommentInput, CommentInputModal, type CommentInputRef } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useCurrentTab, showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface SpotCommentsPageProps {
  spotId: string;
}

export function SpotCommentsPage({ spotId }: SpotCommentsPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const inputRef = useRef<CommentInputRef>(null);

  // スポット操作フック
  const {
    handleEdit: handleSpotEdit,
    handleDelete: handleDeleteSpot,
    handleReport: handleReportSpot,
  } = useSpotActions({ currentUserId });

  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // 現在のユーザー情報
  const { data: currentUser } = useUser(currentUserId ?? null);

  // データ取得
  const { data: spot, isLoading: isLoadingSpot } = useSpotWithDetails(spotId, currentUserId);
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSpotComments(spotId, currentUserId);

  // ページデータをフラット化
  const comments = commentsData?.pages.flat() ?? [];

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
    } else {
      addComment(
        { userId: currentUserId, spotId, content },
        { onSuccess }
      );
    }
  }, [currentUserId, inputText, replyingTo, spotId, addReply, addComment, isSubmitting, t]);

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
          onDelete={handleDeleteSpot}
          onReport={handleReportSpot}
          embeddedUser={spot.user}
          embeddedMasterSpot={spot.master_spot}
          noBorder
        />
        <View className="px-4 py-2 bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border">
          <Text className="text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">{t('comment.comments')}</Text>
        </View>
      </View>
    );
  }, [spot, currentUserId, handleSpotPress, handleUserPress, handleMapPress, handleSpotEdit, handleDeleteSpot, handleReportSpot, t]);

  // 返信先の表示名を取得
  const replyTarget = replyingTo
    ? { displayName: replyingTo.user?.display_name || replyingTo.user?.username || '' }
    : null;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
        <PageHeader title={t('comment.comments')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
      <PageHeader title={t('comment.comments')} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* コメント一覧 */}
        <CommentList
          comments={comments}
          currentUserId={currentUserId}
          onUserPress={handleUserPress}
          onEdit={handleEdit}
          onDeleteConfirm={handleDeleteConfirm}
          onLike={handleLike}
          onReply={handleReply}
          onRefresh={refetch}
          isRefreshing={isLoading}
          isLoading={isLoadingComments}
          ListHeaderComponent={renderSpotHeader}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          isFetchingNextPage={isFetchingNextPage}
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
