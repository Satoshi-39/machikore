/**
 * コメント入力モーダル
 *
 * ボトムシート形式でコメント入力を表示
 * X/Twitter風のデザイン
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useAddSpotComment, useAddMapComment, useAddReplyComment } from '@/entities/comment';
import { useUser } from '@/entities/user';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CommentInputModalProps {
  visible: boolean;
  onClose: () => void;
  /** スポットID（スポットコメント用） */
  spotId?: string | null;
  /** マップID（マップコメント用） */
  mapId?: string | null;
  /** 現在のユーザーID */
  currentUserId?: string | null;
  /** 返信先のコメント */
  replyingTo?: CommentWithUser | null;
}

export function CommentInputModal({
  visible,
  onClose,
  spotId,
  mapId,
  currentUserId,
  replyingTo,
}: CommentInputModalProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // 現在のユーザー情報を取得
  const { data: currentUser } = useUser(currentUserId ?? null);

  // Mutations
  const { mutate: addSpotComment, isPending: isAddingSpotComment } = useAddSpotComment();
  const { mutate: addMapComment, isPending: isAddingMapComment } = useAddMapComment();
  const { mutate: addReply, isPending: isAddingReply } = useAddReplyComment();

  const isSubmitting = isAddingSpotComment || isAddingMapComment || isAddingReply;
  const canSubmit = text.trim() && !isSubmitting;
  const isReplyMode = !!replyingTo;

  // モーダル開閉アニメーション
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start(() => {
        // アニメーション完了後にフォーカス
        inputRef.current?.focus();
      });
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // モーダルが閉じたらテキストをクリア
  useEffect(() => {
    if (!visible) {
      setText('');
    }
  }, [visible]);

  // プレースホルダー
  const placeholder = replyingTo
    ? `返信を入力...`
    : 'コメントを入力...';

  // 送信ハンドラー
  const handleSubmit = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert(replyingTo ? '返信' : 'コメント');
      return;
    }
    if (!text.trim()) return;

    const content = text.trim();

    const onSuccess = () => {
      setText('');
      onClose();
    };

    if (replyingTo) {
      addReply(
        { userId: currentUserId, parentComment: replyingTo, content },
        { onSuccess }
      );
    } else if (spotId) {
      addSpotComment(
        { userId: currentUserId, spotId, content },
        { onSuccess }
      );
    } else if (mapId) {
      addMapComment(
        { userId: currentUserId, mapId, content },
        { onSuccess }
      );
    }
  }, [currentUserId, text, replyingTo, spotId, mapId, addReply, addSpotComment, addMapComment, onClose]);

  // 閉じる処理
  const handleClose = useCallback(() => {
    inputRef.current?.blur();
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* 背景オーバーレイ */}
        <Pressable
          className="flex-1 bg-black/50"
          onPress={handleClose}
        />

        {/* ボトムシート */}
        <Animated.View
          className="bg-white rounded-t-3xl"
          style={{
            paddingBottom: insets.bottom,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* ハンドル */}
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* ヘッダー */}
          <View className="flex-row items-center justify-between px-4 pb-3 border-b border-gray-100">
            <Pressable
              onPress={handleClose}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={24} color={colors.gray[600]} />
            </Pressable>
            <Text className="text-base font-semibold text-gray-800">
              {isReplyMode ? '返信' : 'コメント'}
            </Text>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={{
                backgroundColor: canSubmit ? colors.primary.DEFAULT : colors.gray[200],
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 9999,
                minWidth: 60,
                alignItems: 'center',
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: canSubmit ? 'white' : colors.gray[400],
                  }}
                >
                  投稿
                </Text>
              )}
            </Pressable>
          </View>

          {/* 返信先表示 */}
          {isReplyMode && replyingTo && (
            <View className="px-4 py-3 border-b border-gray-100">
              <View className="flex-row">
                {/* 返信先ユーザーアバター */}
                {replyingTo.user?.avatar_url ? (
                  <Image
                    source={{ uri: replyingTo.user.avatar_url }}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center">
                    <Ionicons name="person" size={16} color={colors.gray[500]} />
                  </View>
                )}
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-gray-800">
                    {replyingTo.user?.display_name || replyingTo.user?.username || 'ユーザー'}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-0.5" numberOfLines={2}>
                    {replyingTo.content}
                  </Text>
                </View>
              </View>
              {/* 返信先への線 */}
              <View className="absolute left-8 top-14 bottom-0 w-0.5 bg-gray-200" />
            </View>
          )}

          {/* 入力エリア */}
          <View className="flex-row px-4 pt-4">
            {/* 現在のユーザーアバター */}
            {currentUser?.avatar_url ? (
              <Image
                source={{ uri: currentUser.avatar_url }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                <Ionicons name="person" size={20} color={colors.gray[500]} />
              </View>
            )}

            {/* 入力欄 */}
            <View className="flex-1 ml-3">
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                placeholderTextColor={colors.gray[400]}
                multiline
                maxLength={500}
                className="text-base text-gray-800 min-h-[120px] max-h-[200px]"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* フッター */}
          <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-100 mt-2">
            {/* 左側：将来的にメディア追加ボタンなど */}
            <View className="flex-row items-center gap-4">
              {/* 将来的に画像添付などのアイコンを追加可能 */}
            </View>

            {/* 右側：文字数カウンター */}
            <View className="flex-row items-center">
              <Text className={`text-xs ${text.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                {text.length}
              </Text>
              <Text className="text-xs text-gray-400">/500</Text>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
