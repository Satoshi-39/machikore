/**
 * マップコメント詳細ページ
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
import { useMapComments, useAddMapComment, useAddReplyComment } from '@/entities/comment';
import { useMap, MapCard } from '@/entities/map';
import { useCurrentUserId, useUser } from '@/entities/user';
import { useCommentActions } from '@/features/comment-actions';
import { useMapActions } from '@/features/map-actions';
import { CommentList } from '@/widgets/comment';
import { PageHeader, CommentInput, CommentInputModal, type CommentInputRef } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useCurrentTab, showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface MapCommentsPageProps {
  mapId: string;
}

export function MapCommentsPage({ mapId }: MapCommentsPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const inputRef = useRef<CommentInputRef>(null);

  // マップ操作フック
  const {
    handleEdit: handleMapEdit,
    handleDelete: handleDeleteMap,
    handleReport: handleReportMap,
  } = useMapActions({ currentUserId });

  // 入力状態
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // 現在のユーザー情報
  const { data: currentUser } = useUser(currentUserId ?? null);

  // データ取得
  const { data: map, isLoading: isLoadingMap } = useMap(mapId);
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMapComments(mapId, currentUserId);

  // ページデータをフラット化
  const comments = commentsData?.pages.flat() ?? [];

  const isLoading = isLoadingMap || isLoadingComments;

  // コメント投稿
  const { mutate: addComment, isPending: isAddingComment } = useAddMapComment();
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
  } = useCommentActions({ mapId, currentUserId });

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
    } else {
      addComment(
        { userId: currentUserId, mapId, content },
        { onSuccess }
      );
    }
  }, [currentUserId, inputText, replyingTo, mapId, addReply, addComment, isSubmitting, t]);

  // ナビゲーションハンドラー
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  const handleMapPress = useCallback(() => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}`);
  }, [router, mapId, currentTab]);

  const handleArticlePress = useCallback((id: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${id}`);
  }, [router, currentTab]);

  // マップヘッダー
  const renderMapHeader = useCallback(() => {
    if (!map) return null;
    return (
      <View>
        <MapCard
          map={map}
          currentUserId={currentUserId}
          onPress={handleMapPress}
          onUserPress={handleUserPress}
          onEdit={handleMapEdit}
          onDelete={handleDeleteMap}
          onReport={handleReportMap}
          onArticlePress={handleArticlePress}
          noBorder
        />
        <View className="px-4 py-2 bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border">
          <Text className="text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">{t('comment.comments')}</Text>
        </View>
      </View>
    );
  }, [map, currentUserId, handleMapPress, handleUserPress, handleMapEdit, handleDeleteMap, handleReportMap, handleArticlePress, t]);

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
          ListHeaderComponent={renderMapHeader}
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
