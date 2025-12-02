/**
 * スポットコメント詳細ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Widgetの組み合わせのみ
 */

import React, { useCallback } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotComments } from '@/entities/comment';
import { useCurrentUserId } from '@/entities/user';
import { useSpotWithDetails, SpotCard } from '@/entities/user-spot';
import { EditCommentModal } from '@/features/edit-comment';
import { CommentInputModal } from '@/features/add-comment';
import { useCommentActions } from '@/features/comment-actions';
import { CommentList } from '@/widgets/comment-list';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';

interface SpotCommentsPageProps {
  spotId: string;
}

export function SpotCommentsPage({ spotId }: SpotCommentsPageProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();

  // データ取得
  const { data: spot, isLoading: isLoadingSpot } = useSpotWithDetails(spotId, currentUserId);
  const { data: comments, isLoading: isLoadingComments, refetch } = useSpotComments(spotId, 50, 0, currentUserId);

  const isLoading = isLoadingSpot || isLoadingComments;

  // コメント操作フック
  const {
    editingComment,
    editText,
    replyingTo,
    isInputModalVisible,
    setEditText,
    closeInputModal,
    handleAddComment,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
    handleDeleteConfirm,
    handleLike,
    handleReply,
    isUpdatingComment,
  } = useCommentActions({ spotId, currentUserId });

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

      {/* コメント追加ボタン */}
      <View className="border-t border-gray-200 px-4 py-3">
        <Pressable
          onPress={handleAddComment}
          className="bg-gray-100 rounded-xl px-4 py-3"
        >
          <Text className="text-gray-400">コメントを追加...</Text>
        </Pressable>
      </View>

      {/* コメント入力モーダル */}
      <CommentInputModal
        visible={isInputModalVisible}
        onClose={closeInputModal}
        spotId={spotId}
        currentUserId={currentUserId}
        replyingTo={replyingTo}
      />

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
