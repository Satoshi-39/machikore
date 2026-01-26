/**
 * コメント入力モーダル
 *
 * ボトムシート形式でコメント入力を表示
 * X/Twitter風のデザイン
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { colors, iconSizeNum } from '@/shared/config';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Text as ButtonText, buttonTextVariants, UserAvatar } from '@/shared/ui';
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
  const { t } = useI18n();
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
    ? t('comment.enterReply')
    : t('comment.enterComment');

  // 送信ハンドラー
  const handleSubmit = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert(replyingTo ? t('comment.reply') : t('comment.comment'));
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
  }, [currentUserId, text, replyingTo, spotId, mapId, addReply, addSpotComment, addMapComment, onClose, t]);

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
          className="bg-surface rounded-t-3xl"
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
          <View className="flex-row items-center justify-between px-4 pb-3 border-b-thin border-outline-variant">
            <Pressable
              onPress={handleClose}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={iconSizeNum.lg} className="text-gray-600" />
            </Pressable>
            <Text className="text-base font-semibold text-on-surface">
              {isReplyMode ? t('comment.reply') : t('comment.comment')}
            </Text>
            <Button
              onPress={handleSubmit}
              disabled={!canSubmit}
              size="sm"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <ButtonText className={buttonTextVariants({ size: 'sm' })}>
                  {t('common.post')}
                </ButtonText>
              )}
            </Button>
          </View>

          {/* 返信先表示 */}
          {isReplyMode && replyingTo && (
            <View className="px-4 py-3 border-b-thin border-outline-variant">
              <View className="flex-row">
                {/* 返信先ユーザーアバター */}
                <UserAvatar
                  url={replyingTo.user?.avatar_url}
                  alt={replyingTo.user?.display_name || replyingTo.user?.username || 'User'}
                  className="w-8 h-8"
                  iconSize={iconSizeNum.sm}
                />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-on-surface">
                    {replyingTo.user?.display_name || replyingTo.user?.username || t('common.user')}
                  </Text>
                  <Text className="text-sm text-on-surface-variant mt-0.5" numberOfLines={2}>
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
            <UserAvatar
              url={currentUser?.avatar_url}
              alt={currentUser?.display_name || currentUser?.username || 'User'}
              className="w-10 h-10"
              iconSize={iconSizeNum.md}
            />

            {/* 入力欄 */}
            <View className="flex-1 ml-3">
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                placeholderTextColor={colors.primitive.gray[400]}
                multiline
                maxLength={500}
                className="text-base text-on-surface min-h-[120px] max-h-[200px]"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* フッター */}
          <View className="flex-row items-center justify-between px-4 py-3 border-t-thin border-outline-variant mt-2">
            {/* 左側：将来的にメディア追加ボタンなど */}
            <View className="flex-row items-center gap-4">
              {/* 将来的に画像添付などのアイコンを追加可能 */}
            </View>

            {/* 右側：文字数カウンター */}
            <View className="flex-row items-center">
              <Text className={`text-xs ${text.length > 450 ? 'text-orange-500' : 'text-on-surface-variant'}`}>
                {text.length}
              </Text>
              <Text className="text-xs text-on-surface-variant">/500</Text>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
