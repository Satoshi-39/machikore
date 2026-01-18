/**
 * CommentList Widget
 *
 * コメント一覧表示Widget
 * 削除確認ダイアログ、いいね、返信表示を管理
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
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
  /** 無限スクロール: 末端到達時のコールバック */
  onEndReached?: () => void;
  /** 無限スクロール: 次ページ取得中フラグ */
  isFetchingNextPage?: boolean;
}

/**
 * 返信一覧コンポーネント（Instagram/Note方式：インデント表示）
 */
function ReplyList({
  parentId,
  currentUserId,
  onUserPress,
  onEdit,
  onDelete,
  onLike,
  onReply,
}: {
  parentId: string;
  currentUserId?: string | null;
  onUserPress: (userId: string) => void;
  onEdit: (comment: CommentWithUser) => void;
  onDelete: (comment: CommentWithUser) => void;
  onLike?: (comment: CommentWithUser) => void;
  onReply?: (comment: CommentWithUser) => void;
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
        <View key={reply.id} className="pl-12">
          <CommentItem
            comment={reply}
            currentUserId={currentUserId}
            onUserPress={onUserPress}
            onEdit={onEdit}
            onDelete={onDelete}
            onLike={onLike}
            onReply={onReply}
            isReply
          />
        </View>
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
  onEndReached,
  isFetchingNextPage = false,
}: CommentListProps) {
  const { t } = useI18n();
  // 展開中の返信スレッド
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // 削除確認ダイアログを表示
  const handleDelete = useCallback((comment: CommentWithUser) => {
    Alert.alert(
      t('comment.deleteComment'),
      t('confirm.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => onDeleteConfirm(comment),
        },
      ]
    );
  }, [onDeleteConfirm, t]);

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
    const hasReplies = item.replies_count > 0;

    return (
      <View className="border-b border-border-light dark:border-dark-border-light">
        <CommentItem
          comment={item}
          currentUserId={currentUserId}
          onUserPress={onUserPress}
          onEdit={onEdit}
          onDelete={handleDelete}
          onLike={onLike}
          onReply={onReply}
          onShowReplies={hasReplies ? handleShowReplies : undefined}
          isRepliesExpanded={isExpanded}
        />
        {/* 返信一覧（インデント表示） */}
        {isExpanded && (
          <ReplyList
            parentId={item.id}
            currentUserId={currentUserId}
            onUserPress={onUserPress}
            onEdit={onEdit}
            onDelete={handleDelete}
            onLike={onLike}
            onReply={onReply}
          />
        )}
      </View>
    );
  }, [currentUserId, onUserPress, onEdit, handleDelete, onLike, onReply, handleShowReplies, expandedReplies]);

  const renderEmpty = useCallback(() => (
    <View className="flex-1 justify-center items-center py-20">
      <Ionicons name="chatbubble-outline" size={48} color={colors.gray[300]} />
      <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">{t('comment.noComments')}</Text>
    </View>
  ), [t]);

  // 次ページ読み込み中のローディング表示
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <FlashList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={renderComment}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
    />
  );
}
