/**
 * 記事コメントプレビュー
 *
 * コメントを数件プレビュー表示し、全件表示へのリンクを提供
 * note風：「コメントを追加...」タップでキーボード一体化モーダルが表示
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { CommentInputModal } from '@/shared/ui';
import { CommentItem, useAddMapComment, useAddReplyComment, useMapCommentsCount } from '@/entities/comment';
import { useUser } from '@/entities/user';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface ArticleCommentPreviewProps {
  comments: CommentWithUser[];
  mapId: string;
  currentUserId?: string | null;
  onViewAllPress: () => void;
  onUserPress: (userId: string) => void;
  onEdit: (comment: CommentWithUser) => void;
  onDelete: (comment: CommentWithUser) => void;
  onLike: (comment: CommentWithUser) => void;
}

export function ArticleCommentPreview({
  comments,
  mapId,
  currentUserId,
  onViewAllPress,
  onUserPress,
  onEdit,
  onDelete,
  onLike,
}: ArticleCommentPreviewProps) {
  // トップレベルコメントの総数を取得
  const { data: totalCount = 0 } = useMapCommentsCount(mapId);

  // モーダル状態
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // 現在のユーザー情報
  const { data: currentUser } = useUser(currentUserId ?? null);

  // コメント投稿
  const { mutate: addComment, isPending: isAddingComment } = useAddMapComment();
  const { mutate: addReply, isPending: isAddingReply } = useAddReplyComment();
  const isSubmitting = isAddingComment || isAddingReply;

  // モーダルを開く
  const openModal = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('コメント');
      return;
    }
    setIsModalVisible(true);
  }, [currentUserId]);

  // モーダルを閉じる
  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setReplyingTo(null);
  }, []);

  // 返信ボタン押下
  const handleReply = useCallback((comment: CommentWithUser) => {
    if (!currentUserId) {
      showLoginRequiredAlert('返信');
      return;
    }
    setReplyingTo(comment);
    setIsModalVisible(true);
  }, [currentUserId]);

  // 返信キャンセル
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // 送信ハンドラー
  const handleSubmit = useCallback(() => {
    if (!currentUserId || !inputText.trim() || isSubmitting) return;

    const content = inputText.trim();

    const onSuccess = () => {
      setInputText('');
      setReplyingTo(null);
      setIsModalVisible(false);
      Keyboard.dismiss();
    };

    if (replyingTo) {
      addReply(
        { userId: currentUserId, parentComment: replyingTo, content },
        { onSuccess }
      );
    } else {
      addComment(
        { userId: currentUserId, mapId, content },
        { onSuccess }
      );
    }
  }, [currentUserId, inputText, replyingTo, mapId, addReply, addComment, isSubmitting]);

  // 返信先の表示名
  const replyTarget = replyingTo
    ? { displayName: replyingTo.user?.display_name || replyingTo.user?.username || '' }
    : null;

  return (
    <View className="mt-6">
      <Text className="text-base font-semibold text-gray-800 mb-3">
        コメント
      </Text>

      {/* コメント追加ボタン（タップでモーダル表示） */}
      <Pressable
        onPress={openModal}
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
                onReply={handleReply}
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

      {/* コメント入力モーダル */}
      <CommentInputModal
        visible={isModalVisible}
        onClose={closeModal}
        avatarUrl={currentUser?.avatar_url}
        inputText={inputText}
        onChangeText={setInputText}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        replyingTo={replyTarget}
        onCancelReply={cancelReply}
      />
    </View>
  );
}
