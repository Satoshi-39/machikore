/**
 * 記事コメントプレビュー
 *
 * コメントを数件プレビュー表示し、全件表示へのリンクを提供
 * コメント追加、いいね、返信、編集機能を含む
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { CommentItem } from '@/entities/comment';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface ArticleCommentPreviewProps {
  comments: CommentWithUser[];
  totalCount: number;
  currentUserId?: string | null;
  onViewAllPress: () => void;
  onAddComment: () => void;
  onUserPress: (userId: string) => void;
  onEdit: (comment: CommentWithUser) => void;
  onDelete: (comment: CommentWithUser) => void;
  onLike: (comment: CommentWithUser) => void;
  onReply: (comment: CommentWithUser) => void;
}

export function ArticleCommentPreview({
  comments,
  totalCount,
  currentUserId,
  onViewAllPress,
  onAddComment,
  onUserPress,
  onEdit,
  onDelete,
  onLike,
  onReply,
}: ArticleCommentPreviewProps) {
  return (
    <View className="mt-6">
      <Text className="text-base font-semibold text-gray-800 mb-3">
        コメント
      </Text>

      {/* コメント追加ボタン */}
      <Pressable
        onPress={onAddComment}
        className="mb-4 bg-gray-100 rounded-xl px-4 py-3"
      >
        <Text className="text-sm text-gray-400">
          コメントを追加...
        </Text>
      </Pressable>

      {comments.length > 0 ? (
        <>
          {/* コメント一覧 */}
          <View className="-mx-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onUserPress={onUserPress}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                onReply={onReply}
              />
            ))}
          </View>

          {/* もっと見る */}
          {totalCount > comments.length && (
            <Pressable onPress={onViewAllPress} className="mt-2">
              <Text className="text-sm text-primary-600">
                コメント{totalCount}件すべてを見る
              </Text>
            </Pressable>
          )}
        </>
      ) : (
        <View className="py-4 items-center">
          <Ionicons name="chatbubble-outline" size={32} color={colors.gray[300]} />
          <Text className="text-sm text-gray-400 mt-2">
            まだコメントがありません
          </Text>
        </View>
      )}
    </View>
  );
}
