/**
 * CommentInput Widget
 *
 * コメント入力・送信を管理するWidget
 * 通常コメントと返信の判定ロジックを内包
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useAddSpotComment, useAddMapComment, useAddReplyComment } from '@/entities/comment';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface CommentInputProps {
  /** スポットID（スポットコメント用） */
  spotId?: string | null;
  /** マップID（マップコメント用） */
  mapId?: string | null;
  /** 現在のユーザーID */
  currentUserId?: string | null;
  /** 返信先のコメント */
  replyingTo?: CommentWithUser | null;
  /** 返信モードをキャンセルするコールバック */
  onCancelReply?: () => void;
}

export function CommentInput({
  spotId,
  mapId,
  currentUserId,
  replyingTo,
  onCancelReply,
}: CommentInputProps) {
  const { t } = useI18n();
  const [text, setText] = useState('');

  // Mutations
  const { mutate: addSpotComment, isPending: isAddingSpotComment } = useAddSpotComment();
  const { mutate: addMapComment, isPending: isAddingMapComment } = useAddMapComment();
  const { mutate: addReply, isPending: isAddingReply } = useAddReplyComment();

  const isSubmitting = isAddingSpotComment || isAddingMapComment || isAddingReply;
  const canSubmit = text.trim() && !isSubmitting;
  const isReplyMode = !!replyingTo;

  // プレースホルダー
  const placeholder = replyingTo
    ? t('comment.replyToUser', { name: replyingTo.user?.display_name || replyingTo.user?.username })
    : t('comment.enterComment');

  // 送信ハンドラー
  const handleSubmit = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert(replyingTo ? t('comment.reply') : t('comment.comment'));
      return;
    }
    if (!text.trim()) return;

    const content = text.trim();

    if (replyingTo) {
      // 返信を投稿
      addReply(
        { userId: currentUserId, parentComment: replyingTo, content },
        {
          onSuccess: () => {
            setText('');
            onCancelReply?.();
          },
        }
      );
    } else if (spotId) {
      // スポットコメントを投稿
      addSpotComment(
        { userId: currentUserId, spotId, content },
        {
          onSuccess: () => {
            setText('');
          },
        }
      );
    } else if (mapId) {
      // マップコメントを投稿
      addMapComment(
        { userId: currentUserId, mapId, content },
        {
          onSuccess: () => {
            setText('');
          },
        }
      );
    }
  }, [currentUserId, text, replyingTo, spotId, mapId, addReply, addSpotComment, addMapComment, onCancelReply, t]);

  // 返信キャンセル
  const handleCancelReply = useCallback(() => {
    setText('');
    onCancelReply?.();
  }, [onCancelReply]);

  return (
    <View className="border-t border-border dark:border-dark-border">
      {/* 返信モード表示 */}
      {isReplyMode && (
        <View className="flex-row items-center justify-between px-4 py-2 bg-background-secondary dark:bg-dark-background-secondary">
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{t('comment.composingReply')}</Text>
          <Pressable onPress={handleCancelReply} hitSlop={8}>
            <Ionicons name="close" size={20} color={colors.gray[500]} />
          </Pressable>
        </View>
      )}

      <View className="flex-row items-end px-4 py-3">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          multiline
          maxLength={500}
          className="flex-1 bg-muted dark:bg-dark-muted rounded-2xl px-4 py-2 max-h-24 text-base"
          style={{ minHeight: 40 }}
        />
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="ml-2 p-2"
        >
          <Ionicons
            name="send"
            size={24}
            color={canSubmit ? colors.primary.DEFAULT : colors.gray[300]}
          />
        </Pressable>
      </View>
    </View>
  );
}
