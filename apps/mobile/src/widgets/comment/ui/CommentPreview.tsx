/**
 * コメントプレビュー
 *
 * 詳細カード用のコメントプレビュー表示
 * 親コメント1件 + 返信1件程度を表示し、全件表示へのリンクを提供
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { CommentItem, useCommentReplies } from '@/entities/comment';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface CommentPreviewProps {
  /** プレビュー表示するコメント一覧（親コメントのみ） */
  comments: CommentWithUser[];
  /** コメント総数 */
  totalCount: number;
  currentUserId?: string | null;
  /** ユーザータップ時 */
  onUserPress: (userId: string) => void;
  /** 全件表示タップ時 */
  onViewAll: () => void;
  /** いいねタップ時 */
  onLike?: (comment: CommentWithUser) => void;
  /** 返信タップ時 */
  onReply?: (comment: CommentWithUser) => void;
}

/**
 * 最初の返信を1件表示するコンポーネント
 */
function FirstReply({
  parentId,
  currentUserId,
  onUserPress,
  onLike,
}: {
  parentId: string;
  currentUserId?: string | null;
  onUserPress: (userId: string) => void;
  onLike?: (comment: CommentWithUser) => void;
}) {
  const { data: repliesData } = useCommentReplies(parentId, currentUserId);

  // 最初のページの最初の返信を取得
  const firstReply = repliesData?.pages[0]?.[0];

  if (!firstReply) {
    return null;
  }

  return (
    <View className="pl-12">
      <CommentItem
        comment={firstReply}
        currentUserId={currentUserId}
        onUserPress={onUserPress}
        onEdit={() => {}}
        onDelete={() => {}}
        onLike={onLike}
        isReply
      />
    </View>
  );
}

export function CommentPreview({
  comments,
  totalCount,
  currentUserId,
  onUserPress,
  onViewAll,
  onLike,
  onReply,
}: CommentPreviewProps) {
  const { t } = useI18n();

  // 最初の親コメント1件のみ表示
  const previewComment = useMemo(() => comments[0], [comments]);

  // 返信を含めた残りの件数を計算
  // totalCountには親コメントの数のみが含まれているが、
  // 表示しているのは親1件+返信1件なので、残りは totalCount - 1 + (返信総数 - 1)
  // 簡易的に totalCount > 1 または 返信がある場合に「もっと見る」を表示
  const hasMore = totalCount > 1 || (previewComment?.replies_count ?? 0) > 1;

  if (comments.length === 0) {
    return (
      <View className="py-4 items-center">
        <Ionicons name="chatbubble-outline" size={32} color={colors.gray[300]} />
        <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted mt-2">
          {t('comment.noComments')}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* 最初の親コメント */}
      {previewComment && (
        <View className="-mx-4">
          <CommentItem
            comment={previewComment}
            currentUserId={currentUserId}
            onUserPress={onUserPress}
            onEdit={() => {}}
            onDelete={() => {}}
            onLike={onLike}
            onReply={onReply}
          />
          {/* 最初の返信（あれば） */}
          {previewComment.replies_count > 0 && (
            <FirstReply
              parentId={previewComment.id}
              currentUserId={currentUserId}
              onUserPress={onUserPress}
              onLike={onLike}
            />
          )}
        </View>
      )}

      {/* もっと見るリンク */}
      {hasMore && (
        <Pressable onPress={onViewAll} className="py-2">
          <Text className="text-sm text-primary">
            {t('comment.viewAllComments', { count: totalCount })}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
