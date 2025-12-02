/**
 * スポットコメント詳細ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Widgetの組み合わせのみ
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useSpotComments,
  useUpdateComment,
  useDeleteComment,
  useLikeComment,
  useUnlikeComment,
} from '@/entities/comment';
import { useCurrentUserId } from '@/entities/user';
import { useSpotWithDetails, SpotCard } from '@/entities/user-spot';
import { EditCommentModal } from '@/features/edit-comment';
import { CommentList } from '@/widgets/comment-list';
import { CommentInput } from '@/widgets/comment-input';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert, useCurrentTab } from '@/shared/lib';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface SpotCommentsPageProps {
  spotId: string;
}

export function SpotCommentsPage({ spotId }: SpotCommentsPageProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();

  const [editingComment, setEditingComment] = useState<CommentWithUser | null>(null);
  const [editText, setEditText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // データ取得
  const { data: spot, isLoading: isLoadingSpot } = useSpotWithDetails(spotId, currentUserId);
  const { data: comments, isLoading: isLoadingComments, refetch } = useSpotComments(spotId, 50, 0, currentUserId);
  const { mutate: updateComment, isPending: isUpdatingComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: likeComment } = useLikeComment();
  const { mutate: unlikeComment } = useUnlikeComment();

  const isLoading = isLoadingSpot || isLoadingComments;

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
    router.push(`/edit-spot?id=${id}`);
  }, [router]);

  // コメント編集ハンドラー
  const handleEdit = useCallback((comment: CommentWithUser) => {
    setEditingComment(comment);
    setEditText(comment.content);
  }, []);

  const handleEditSubmit = useCallback(() => {
    if (!editingComment || !editText.trim() || isUpdatingComment) return;

    updateComment(
      {
        commentId: editingComment.id,
        content: editText.trim(),
        spotId: editingComment.spot_id,
        mapId: editingComment.map_id,
      },
      {
        onSuccess: () => {
          setEditingComment(null);
          setEditText('');
        },
      }
    );
  }, [editingComment, editText, isUpdatingComment, updateComment]);

  const handleEditCancel = useCallback(() => {
    setEditingComment(null);
    setEditText('');
  }, []);

  // コメント削除ハンドラー
  const handleDeleteConfirm = useCallback((comment: CommentWithUser) => {
    deleteComment({
      commentId: comment.id,
      spotId: comment.spot_id,
      parentId: comment.parent_id,
    });
  }, [deleteComment]);

  // いいねハンドラー
  const handleLike = useCallback((comment: CommentWithUser) => {
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (comment.is_liked) {
      unlikeComment({ userId: currentUserId, commentId: comment.id, spotId: comment.spot_id });
    } else {
      likeComment({ userId: currentUserId, commentId: comment.id, spotId: comment.spot_id });
    }
  }, [currentUserId, likeComment, unlikeComment]);

  // 返信ハンドラー
  const handleReply = useCallback((comment: CommentWithUser) => {
    if (!currentUserId) {
      showLoginRequiredAlert('返信');
      return;
    }
    setReplyingTo(comment);
  }, [currentUserId]);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

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
        <View className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Text className="text-sm font-semibold text-gray-600">コメント</Text>
        </View>
      </View>
    );
  }, [spot, currentUserId, handleSpotPress, handleUserPress, handleMapPress, handleSpotEdit]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <PageHeader title="コメント" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <PageHeader title="コメント" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
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

        <CommentInput
          spotId={spotId}
          currentUserId={currentUserId}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
        />
      </KeyboardAvoidingView>

      <EditCommentModal
        visible={!!editingComment}
        editText={editText}
        onChangeText={setEditText}
        onSubmit={handleEditSubmit}
        onCancel={handleEditCancel}
        isUpdating={isUpdatingComment}
      />
    </SafeAreaView>
  );
}
