/**
 * ReplyDetailView Widget
 *
 * 親コメント + 返信一覧を表示する詳細ビュー
 * コメントモーダル内で「◯件の返信を表示」タップ時に表示
 */

import React from 'react';
import { View, FlatList } from 'react-native';
import { CommentItem, useCommentReplies } from '@/entities/comment';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface ReplyDetailViewProps {
  /** 親コメント */
  parentComment: CommentWithUser;
  /** 現在のユーザーID */
  currentUserId?: string | null;
  /** ユーザータップ時 */
  onUserPress: (userId: string) => void;
  /** 編集時 */
  onEdit: (comment: CommentWithUser) => void;
  /** 削除時 */
  onDelete: (comment: CommentWithUser) => void;
  /** いいね時 */
  onLike: (comment: CommentWithUser) => void;
  /** 返信時 */
  onReply: (comment: CommentWithUser) => void;
}

export function ReplyDetailView({
  parentComment,
  currentUserId,
  onUserPress,
  onEdit,
  onDelete,
  onLike,
  onReply,
}: ReplyDetailViewProps) {
  const { data: replies } = useCommentReplies(parentComment.id, currentUserId);

  return (
    <View className="flex-1">
      <FlatList
        data={[parentComment, ...(replies || [])]}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isReply = index > 0;
          return (
            <View className={isReply ? 'pl-10' : ''}>
              <CommentItem
                comment={item}
                currentUserId={currentUserId}
                onUserPress={onUserPress}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                onLike={() => onLike(item)}
                onReply={() => onReply(item)}
                isReply={isReply}
              />
            </View>
          );
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
