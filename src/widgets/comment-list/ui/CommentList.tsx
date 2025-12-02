/**
 * CommentList Widget
 *
 * コメント一覧表示Widget
 * 削除確認ダイアログ、いいね、返信表示を管理
 */

import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { CommentItem, useCommentReplies } from '@/entities/comment';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface CommentListProps {
  comments: CommentWithUser[];
  currentUserId?: string | null;
  onUserPress: (userId: string) => void;
  onEdit: (comment: CommentWithUser) => void;
  onDeleteConfirm: (comment: CommentWithUser) => void;
  onLike?: (comment: CommentWithUser) => void;
  onReply?: (comment: CommentWithUser) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

/**
 * 返信一覧コンポーネント
 */
function ReplyList({
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
  onLike?: (comment: CommentWithUser) => void;
}) {
  const { data: replies, isLoading } = useCommentReplies(parentId, currentUserId);

  if (isLoading) {
    return (
      <View className="py-4 pl-12">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <>
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          currentUserId={currentUserId}
          onUserPress={onUserPress}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
          isReply
        />
      ))}
    </>
  );
}

export function CommentList({
  comments,
  currentUserId,
  onUserPress,
  onEdit,
  onDeleteConfirm,
  onLike,
  onReply,
  onRefresh,
  isRefreshing = false,
  ListHeaderComponent,
}: CommentListProps) {
  // 展開中の返信スレッド
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // 削除確認ダイアログを表示
  const handleDelete = useCallback((comment: CommentWithUser) => {
    Alert.alert(
      'コメントを削除',
      'このコメントを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => onDeleteConfirm(comment),
        },
      ]
    );
  }, [onDeleteConfirm]);

  // 返信を表示/非表示
  const handleShowReplies = useCallback((comment: CommentWithUser) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(comment.id)) {
        next.delete(comment.id);
      } else {
        next.add(comment.id);
      }
      return next;
    });
  }, []);

  const renderComment = useCallback(({ item }: { item: CommentWithUser }) => {
    const isExpanded = expandedReplies.has(item.id);

    return (
      <View>
        <CommentItem
          comment={item}
          currentUserId={currentUserId}
          onUserPress={onUserPress}
          onEdit={onEdit}
          onDelete={handleDelete}
          onLike={onLike}
          onReply={onReply}
          onShowReplies={item.replies_count > 0 ? handleShowReplies : undefined}
          isRepliesExpanded={isExpanded}
        />
        {/* 返信一覧 */}
        {isExpanded && (
          <ReplyList
            parentId={item.id}
            currentUserId={currentUserId}
            onUserPress={onUserPress}
            onEdit={onEdit}
            onDelete={handleDelete}
            onLike={onLike}
          />
        )}
      </View>
    );
  }, [currentUserId, onUserPress, onEdit, handleDelete, onLike, onReply, handleShowReplies, expandedReplies]);

  const renderEmpty = useCallback(() => (
    <View className="flex-1 justify-center items-center py-20">
      <Ionicons name="chatbubble-outline" size={48} color={colors.gray[300]} />
      <Text className="text-gray-400 mt-4">まだコメントがありません</Text>
    </View>
  ), []);

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={renderComment}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={{ flexGrow: 1 }}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
}
