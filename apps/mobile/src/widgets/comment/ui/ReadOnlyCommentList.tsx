/**
 * ReadOnlyCommentList Widget
 *
 * 読み取り専用のコメント一覧
 * ScrollView内で使用可能（FlatListを使わない）
 * コメントの追加・編集・削除・返信はモーダルで行う
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, COMMENT_DISPLAY, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { UserAvatar } from '@/shared/ui';
import { formatRelativeTime } from '@/shared/lib';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

/**
 * テキストを最大文字数で省略
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

interface ReadOnlyCommentListProps {
  comments: CommentWithUser[];
  /** コメント総数（APIから取得した値） */
  totalCount: number;
  onUserPress: (userId: string) => void;
  /** コメントモーダルを開く（focusCommentId: 特定のコメントにフォーカス） */
  onOpenCommentModal: (focusCommentId?: string) => void;
}

/**
 * 読み取り専用コメントアイテム
 */
function ReadOnlyCommentItem({
  comment,
  onUserPress,
  onOpenCommentModal,
}: {
  comment: CommentWithUser;
  onUserPress: (userId: string) => void;
  onOpenCommentModal: (focusCommentId?: string) => void;
}) {
  const { t, locale } = useI18n();
  const hasReplies = comment.replies_count > 0;

  return (
    <View className="flex-row p-4 border-b-thin border-outline-variant">
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
              <Text className="font-semibold text-on-surface">
                {comment.user?.display_name || comment.user?.username || t('comment.defaultUser')}
              </Text>
            </Pressable>
          </View>
          <Text className="text-xs text-on-surface-variant">
            {formatRelativeTime(comment.created_at, locale)}
          </Text>
        </View>

        <Text className="text-on-surface-variant mt-1">
          {truncateText(comment.content, COMMENT_DISPLAY.MAX_TEXT_LENGTH)}
        </Text>

        {/* いいね数表示（読み取り専用） */}
        {comment.likes_count > 0 && (
          <View className="flex-row items-center mt-2">
            <Ionicons
              name={comment.is_liked ? 'heart' : 'heart-outline'}
              size={iconSizeNum.xs}
              color={comment.is_liked ? colors.light.error : colors.primitive.gray[400]}
            />
            <Text className="ml-1 text-xs text-on-surface-variant">
              {comment.likes_count}
            </Text>
          </View>
        )}

        {/* 返信を表示リンク（返信がある場合） */}
        {hasReplies && (
          <Pressable
            onPress={() => onOpenCommentModal(comment.id)}
            className="mt-2"
            hitSlop={8}
          >
            <Text className="text-xs text-blue-500">
              {t('comment.showReplies', { count: comment.replies_count })}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function ReadOnlyCommentList({
  comments,
  totalCount,
  onUserPress,
  onOpenCommentModal,
}: ReadOnlyCommentListProps) {
  const { t } = useI18n();

  if (comments.length === 0) {
    return (
      <View className="py-8 items-center">
        <Ionicons name="chatbubble-outline" size={iconSizeNum.xl} className="text-gray-300" />
        <Text className="text-on-surface-variant mt-2 text-sm">
          {t('comment.noComments')}
        </Text>
      </View>
    );
  }

  // プレビュー表示件数で制限
  const displayedComments = comments.slice(0, COMMENT_DISPLAY.PREVIEW_COUNT);
  const hasMoreComments = totalCount > 0;

  return (
    <View>
      {displayedComments.map((comment) => (
        <ReadOnlyCommentItem
          key={comment.id}
          comment={comment}
          onUserPress={onUserPress}
          onOpenCommentModal={onOpenCommentModal}
        />
      ))}

      {/* もっと見るボタン */}
      {hasMoreComments && (
        <Pressable
          onPress={() => onOpenCommentModal()}
          className="py-3 items-center"
          hitSlop={8}
        >
          <Text className="text-sm text-primary font-medium">
            {t('comment.viewAllComments', { count: totalCount })}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
