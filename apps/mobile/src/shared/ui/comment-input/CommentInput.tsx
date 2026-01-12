/**
 * コメント入力コンポーネント
 *
 * X/note風のインライン入力欄
 * キーボードの上に固定表示され、一体化した見た目を実現
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, INPUT_LIMITS } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface ReplyTarget {
  displayName: string;
}

interface CommentInputProps {
  /** ユーザーのアバターURL */
  avatarUrl?: string | null;
  /** 入力テキスト */
  inputText: string;
  /** テキスト変更ハンドラー */
  onChangeText: (text: string) => void;
  /** 送信ハンドラー */
  onSubmit: () => void;
  /** 送信中かどうか */
  isSubmitting?: boolean;
  /** 返信先 */
  replyingTo?: ReplyTarget | null;
  /** 返信キャンセルハンドラー */
  onCancelReply?: () => void;
  /** プレースホルダー */
  placeholder?: string;
  /** バリアント: inline（記事内）, fixed（ページ下部固定） */
  variant?: 'inline' | 'fixed';
}

export interface CommentInputRef {
  focus: () => void;
}

export const CommentInput = forwardRef<CommentInputRef, CommentInputProps>(
  function CommentInput(
    {
      avatarUrl,
      inputText,
      onChangeText,
      onSubmit,
      isSubmitting = false,
      replyingTo,
      onCancelReply,
      placeholder,
      variant = 'fixed',
    },
    ref
  ) {
    const { t } = useI18n();
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    const canSubmit = inputText.trim() && !isSubmitting;
    const defaultPlaceholder = replyingTo ? t('comment.enterReply') : t('comment.addComment');

    const isInline = variant === 'inline';

    return (
      <View className={isInline ? '' : 'border-t border-border dark:border-dark-border bg-surface dark:bg-dark-surface-secondary'}>
        {/* 返信先表示 */}
        {replyingTo && (
          <View
            className={`flex-row items-center px-4 py-2 bg-background-secondary dark:bg-dark-background-secondary border-b border-border-light dark:border-dark-border-light ${
              isInline ? 'rounded-t-xl' : ''
            }`}
          >
            <Text className="flex-1 text-sm text-foreground-secondary dark:text-dark-foreground-secondary" numberOfLines={1}>
              {t('comment.replyingTo', { name: replyingTo.displayName })}
            </Text>
            <Pressable onPress={onCancelReply} className="p-1">
              <Ionicons
                name="close-circle"
                size={isInline ? 18 : 20}
                color={colors.gray[400]}
              />
            </Pressable>
          </View>
        )}

        {/* 入力欄 */}
        <View
          className={`flex-row items-end ${isInline ? 'px-3 py-2' : 'px-4 py-3'}`}
          style={
            isInline
              ? {
                  backgroundColor: colors.gray[100],
                  borderTopLeftRadius: replyingTo ? 0 : 12,
                  borderTopRightRadius: replyingTo ? 0 : 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }
              : undefined
          }
        >
          {/* アバター */}
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-8 h-8 rounded-full mr-3"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
              <Ionicons name="person" size={16} color={colors.gray[500]} />
            </View>
          )}

          {/* テキスト入力 */}
          {isInline ? (
            <TextInput
              ref={inputRef}
              value={inputText}
              onChangeText={onChangeText}
              placeholder={placeholder || defaultPlaceholder}
              placeholderTextColor={colors.gray[400]}
              multiline
              maxLength={500}
              className="flex-1 text-base text-foreground dark:text-dark-foreground max-h-24"
              style={{ minHeight: 24 }}
            />
          ) : (
            <View className="flex-1 flex-row items-end bg-muted dark:bg-dark-muted rounded-2xl px-4 py-2">
              <TextInput
                ref={inputRef}
                value={inputText}
                onChangeText={onChangeText}
                placeholder={placeholder || defaultPlaceholder}
                placeholderTextColor={colors.gray[400]}
                multiline
                maxLength={INPUT_LIMITS.COMMENT}
                className="flex-1 text-base text-foreground dark:text-dark-foreground max-h-24"
                style={{ minHeight: 24 }}
              />
            </View>
          )}

          {/* 送信ボタン */}
          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            className={isInline ? 'ml-2 p-1' : 'ml-2 p-2'}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            ) : (
              <Ionicons
                name="send"
                size={isInline ? 22 : 24}
                color={canSubmit ? colors.primary.DEFAULT : colors.gray[300]}
              />
            )}
          </Pressable>
        </View>
      </View>
    );
  }
);
