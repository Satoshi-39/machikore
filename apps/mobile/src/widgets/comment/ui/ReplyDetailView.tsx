/**
 * ReplyDetailView Widget
 *
 * 親コメント + 返信一覧を表示する詳細ビュー
 * コメントモーダル内で「◯件の返信を表示」タップ時に表示
 */

import React, { useCallback, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { CommentItem, useCommentReplies } from '@/entities/comment';
import { colors } from '@/shared/config';
import type { CommentWithUser } from '@/shared/api/supabase/comments';
import type { UserBasicInfo } from '@/shared/types';

interface ReplyDetailViewProps {
  /** 親コメント */
  parentComment: CommentWithUser;
  /** 現在のユーザーID */
  currentUserId?: string | null;
  /** 投稿者ID（投稿者いいね表示用） */
  authorId?: string | null;
  /** 投稿者情報（投稿者いいねアバター表示用） */
  author?: UserBasicInfo | null;
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
  /** コンテンツの下部パディング（入力エリアの高さ分） */
  contentPaddingBottom?: number;
}

export function ReplyDetailView({
  parentComment,
  currentUserId,
  authorId,
  author,
  onUserPress,
  onEdit,
  onDelete,
  onLike,
  onReply,
  contentPaddingBottom = 0,
}: ReplyDetailViewProps) {
  const {
    data: repliesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommentReplies(parentComment.id, { currentUserId, authorId, author });

  // ページデータをフラット化して親コメントと結合
  const replies = repliesData?.pages.flat() ?? [];
  const allComments = useMemo(
    () => [parentComment, ...replies],
    [parentComment, replies]
  );

  // 末端到達時に次ページを取得
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // フッターコンポーネント（読み込み中表示）
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <View className="flex-1">
      <BottomSheetFlatList<CommentWithUser>
        data={allComments}
        keyExtractor={(item: CommentWithUser) => item.id}
        renderItem={({ item, index }: { item: CommentWithUser; index: number }) => {
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
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: contentPaddingBottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
