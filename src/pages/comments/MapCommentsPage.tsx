/**
 * マップコメント詳細ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Widgetの組み合わせのみ
 */

import React, { useCallback } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMapComments } from '@/entities/comment';
import { useMap, MapCard } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { EditCommentModal } from '@/features/edit-comment';
import { CommentInputModal } from '@/features/add-comment';
import { useCommentActions } from '@/features/comment-actions';
import { CommentList } from '@/widgets/comment-list';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';

interface MapCommentsPageProps {
  mapId: string;
}

export function MapCommentsPage({ mapId }: MapCommentsPageProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();

  // データ取得
  const { data: map, isLoading: isLoadingMap } = useMap(mapId);
  const { data: comments, isLoading: isLoadingComments, refetch } = useMapComments(mapId, 50, 0, currentUserId);

  const isLoading = isLoadingMap || isLoadingComments;

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
  } = useCommentActions({ mapId, currentUserId });

  // ナビゲーションハンドラー
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  const handleMapPress = useCallback(() => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}`);
  }, [router, mapId, currentTab]);

  const handleMapEdit = useCallback((id: string) => {
    router.push(`/edit-map?id=${id}`);
  }, [router]);

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
          onArticlePress={handleArticlePress}
        />
        <View className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Text className="text-sm font-semibold text-gray-600">コメント</Text>
        </View>
      </View>
    );
  }, [map, currentUserId, handleMapPress, handleUserPress, handleMapEdit, handleArticlePress]);

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
        ListHeaderComponent={renderMapHeader}
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
        mapId={mapId}
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
