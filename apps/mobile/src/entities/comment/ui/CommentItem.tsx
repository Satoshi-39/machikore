/**
 * CommentItem コンポーネント
 *
 * コメントを表示するコンポーネント
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { ModalPopupMenu, type ModalPopupMenuItem, UserAvatar } from '@/shared/ui';
import { formatRelativeTime } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
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
  /** 返信コメントかどうか */
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
  const { t, locale } = useI18n();
  const isOwner = currentUserId === comment.user_id;
  const hasReplies = comment.replies_count > 0;

  const menuItems: ModalPopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: t('comment.edit'),
      icon: 'create-outline',
      onPress: () => onEdit(comment),
    },
    {
      id: 'delete',
      label: t('comment.delete'),
      icon: 'trash-outline',
      destructive: true,
      onPress: () => onDelete(comment),
    },
  ], [comment, onEdit, onDelete, t]);

  return (
    <View className="flex-row p-4">
      {/* アバター */}
      <Pressable onPress={() => onUserPress(comment.user_id)}>
        <UserAvatar
          url={comment.user?.avatar_url}
          alt={comment.user?.display_name || comment.user?.username || 'User'}
          className="w-10 h-10"
          iconSize={20}
        />
      </Pressable>

      {/* コメント内容 */}
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 flex-wrap">
            <Pressable onPress={() => onUserPress(comment.user_id)}>
              <Text className="font-semibold text-foreground dark:text-dark-foreground">
                {comment.user?.display_name || comment.user?.username || t('comment.defaultUser')}
              </Text>
            </Pressable>
          </View>
          <View className="flex-row items-center">
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">{formatRelativeTime(comment.created_at, locale)}</Text>
            {isOwner && (
              <ModalPopupMenu
                items={menuItems}
                triggerSize={16}
                triggerColor={colors.gray[400]}
              />
            )}
          </View>
        </View>
        {/* 返信先ユーザー名（Instagram方式） */}
        {comment.reply_to_user && (
          <Pressable
            onPress={() => onUserPress(comment.reply_to_user!.id)}
            className="mt-1"
          >
            <Text className="text-primary text-sm">
              @{comment.reply_to_user.display_name || comment.reply_to_user.username}
            </Text>
          </Pressable>
        )}
        <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-1">{comment.content}</Text>

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
              {/* 投稿者いいねアイコン */}
              {comment.is_liked_by_author && comment.author && (
                <View className="ml-1.5">
                  <UserAvatar
                    url={comment.author.avatar_url}
                    alt={comment.author.display_name || comment.author.username || 'Author'}
                    className="w-4 h-4"
                    iconSize={10}
                  />
                </View>
              )}
            </Pressable>
          )}

          {/* 返信ボタン（すべてのコメントで表示） */}
          {onReply && (
            <Pressable
              onPress={() => onReply(comment)}
              className="flex-row items-center"
              hitSlop={8}
            >
              <Ionicons name="chatbubble-outline" size={16} color={colors.gray[400]} />
              <Text className="ml-1 text-xs text-foreground-muted dark:text-dark-foreground-muted">{t('comment.reply')}</Text>
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
                ? t('comment.hideReplies')
                : t('comment.showReplies', { count: comment.replies_count })}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
