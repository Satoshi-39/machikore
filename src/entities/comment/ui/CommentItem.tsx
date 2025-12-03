/**
 * CommentItem コンポーネント
 *
 * コメントを表示するコンポーネント
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { formatRelativeTime } from '@/shared/lib';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface CommentItemProps {
  comment: CommentWithUser;
  currentUserId?: string | null;
  onUserPress: (userId: string) => void;
  onEdit: (comment: CommentWithUser) => void;
  onDelete: (comment: CommentWithUser) => void;
  onLike?: (comment: CommentWithUser) => void;
  onReply?: (comment: CommentWithUser) => void;
  onShowReplies?: (comment: CommentWithUser) => void;
  /** 返信コメントかどうか（インデント表示） */
  isReply?: boolean;
  /** 返信が展開中かどうか */
  isRepliesExpanded?: boolean;
}

export function CommentItem({
  comment,
  currentUserId,
  onUserPress,
  onEdit,
  onDelete,
  onLike,
  onReply,
  onShowReplies,
  isReply = false,
  isRepliesExpanded = false,
}: CommentItemProps) {
  const isOwner = currentUserId === comment.user_id;
  const hasReplies = comment.replies_count > 0;

  const menuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: '編集',
      icon: 'create-outline',
      onPress: () => onEdit(comment),
    },
    {
      id: 'delete',
      label: '削除',
      icon: 'trash-outline',
      destructive: true,
      onPress: () => onDelete(comment),
    },
  ], [comment, onEdit, onDelete]);

  return (
    <View className={`flex-row p-4 border-b border-border-light dark:border-dark-border-light ${isReply ? 'pl-12 bg-background-secondary dark:bg-dark-background-secondary' : ''}`}>
      {/* アバター */}
      <Pressable onPress={() => onUserPress(comment.user_id)}>
        {comment.user?.avatar_url ? (
          <Image
            source={{ uri: comment.user.avatar_url }}
            className={isReply ? 'w-8 h-8 rounded-full' : 'w-10 h-10 rounded-full'}
          />
        ) : (
          <View className={`rounded-full bg-gray-200 justify-center items-center ${isReply ? 'w-8 h-8' : 'w-10 h-10'}`}>
            <Ionicons name="person" size={isReply ? 16 : 20} color={colors.gray[500]} />
          </View>
        )}
      </Pressable>

      {/* コメント内容 */}
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => onUserPress(comment.user_id)}>
            <Text className={`font-semibold text-foreground dark:text-dark-foreground ${isReply ? 'text-sm' : ''}`}>
              {comment.user?.display_name || comment.user?.username || 'ユーザー'}
            </Text>
          </Pressable>
          <View className="flex-row items-center">
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">{formatRelativeTime(comment.created_at)}</Text>
            {isOwner && (
              <PopupMenu
                items={menuItems}
                triggerSize={16}
                triggerColor={colors.gray[400]}
              />
            )}
          </View>
        </View>
        <Text className={`text-foreground-secondary dark:text-dark-foreground-secondary mt-1 ${isReply ? 'text-sm' : ''}`}>{comment.content}</Text>

        {/* アクションボタン */}
        <View className="flex-row items-center mt-2 gap-4">
          {/* いいねボタン */}
          {onLike && (
            <Pressable
              onPress={() => onLike(comment)}
              className="flex-row items-center"
              hitSlop={8}
            >
              <Ionicons
                name={comment.is_liked ? 'heart' : 'heart-outline'}
                size={16}
                color={comment.is_liked ? colors.danger : colors.gray[400]}
              />
              {comment.likes_count > 0 && (
                <Text className={`ml-1 text-xs ${comment.is_liked ? 'text-red-500' : 'text-foreground-muted dark:text-dark-foreground-muted'}`}>
                  {comment.likes_count}
                </Text>
              )}
            </Pressable>
          )}

          {/* 返信ボタン（トップレベルコメントのみ） */}
          {onReply && !isReply && (
            <Pressable
              onPress={() => onReply(comment)}
              className="flex-row items-center"
              hitSlop={8}
            >
              <Ionicons name="chatbubble-outline" size={16} color={colors.gray[400]} />
              <Text className="ml-1 text-xs text-foreground-muted dark:text-dark-foreground-muted">返信</Text>
            </Pressable>
          )}
        </View>

        {/* 返信を表示/非表示リンク（トップレベルかつ返信がある場合） */}
        {hasReplies && !isReply && onShowReplies && (
          <Pressable
            onPress={() => onShowReplies(comment)}
            className="mt-2"
            hitSlop={8}
          >
            <Text className="text-xs text-blue-500">
              {isRepliesExpanded
                ? '返信を非表示'
                : `${comment.replies_count}件の返信を表示`}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
