/**
 * コメント入力モーダル
 *
 * note/X風のキーボード一体化モーダル
 * 画面下部からキーボードと一緒にスライドして表示
 * 新規投稿・返信・編集に対応
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { CommentInput, type CommentInputRef } from './CommentInput';

interface ReplyTarget {
  displayName: string;
}

interface CommentInputModalProps {
  /** モーダルの表示状態 */
  visible: boolean;
  /** モーダルを閉じるハンドラー */
  onClose: () => void;
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
  /** 編集モード */
  isEditing?: boolean;
}

export function CommentInputModal({
  visible,
  onClose,
  avatarUrl,
  inputText,
  onChangeText,
  onSubmit,
  isSubmitting = false,
  replyingTo,
  onCancelReply,
  placeholder,
  isEditing = false,
}: CommentInputModalProps) {
  const inputRef = useRef<CommentInputRef>(null);

  // モーダルが開いたら自動的にフォーカス
  useEffect(() => {
    if (visible) {
      // 少し遅延させてモーダルのアニメーション後にフォーカス
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // 背景タップで閉じる
  const handleBackgroundPress = () => {
    Keyboard.dismiss();
    onClose();
  };

  // 編集モード用のデフォルトプレースホルダー
  const defaultPlaceholder = isEditing
    ? 'コメントを編集...'
    : replyingTo
    ? '返信を入力...'
    : 'コメントを追加...';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* 背景オーバーレイ */}
        <Pressable
          onPress={handleBackgroundPress}
          className="flex-1 bg-black/30"
        />

        {/* 入力エリア（キーボードの上に固定） */}
        <View className="bg-white">
          {/* 編集モードヘッダー */}
          {isEditing && (
            <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
              <Text className="text-sm font-semibold text-gray-600">
                コメントを編集
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <Ionicons name="close" size={20} color={colors.gray[500]} />
              </Pressable>
            </View>
          )}

          <CommentInput
            ref={inputRef}
            avatarUrl={avatarUrl}
            inputText={inputText}
            onChangeText={onChangeText}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            replyingTo={replyingTo}
            onCancelReply={onCancelReply}
            placeholder={placeholder || defaultPlaceholder}
            variant="fixed"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
