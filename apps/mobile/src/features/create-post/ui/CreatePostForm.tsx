/**
 * 投稿作成フォーム
 *
 * FSDの原則：Features層はユーザーアクションを実現する機能
 */

import React, { useState } from 'react';
import { colors, iconSizeNum } from '@/shared/config';
import { View, TextInput, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

interface CreatePostFormProps {
  onSubmit: (content: string, machiId?: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CreatePostForm({
  onSubmit,
  onCancel,
  isSubmitting = false
}: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [selectedMachiId] = useState<string | undefined>(); // TODO: 街選択機能実装時に使用

  const maxLength = 500;
  const isValid = content.trim().length > 0 && content.length <= maxLength;

  const handleSubmit = () => {
    if (isValid && !isSubmitting) {
      onSubmit(content.trim(), selectedMachiId);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b-thin border-outline">
        <Pressable onPress={onCancel} disabled={isSubmitting}>
          <Text className="text-base text-on-surface-variant">キャンセル</Text>
        </Pressable>
        <Text className="text-lg font-semibold">新規投稿</Text>
        <Button
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
          size="sm"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ButtonText className={buttonTextVariants({ size: 'sm' })}>投稿</ButtonText>
          )}
        </Button>
      </View>

      {/* 本文入力 */}
      <View className="flex-1 p-4">
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="今日はどこに行きましたか？"
          placeholderTextColor={colors.light["on-surface-variant"]}
          multiline
          maxLength={maxLength}
          editable={!isSubmitting}
          className="flex-1 text-base text-on-surface"
          style={{ textAlignVertical: 'top' }}
          autoFocus
        />
      </View>

      {/* フッター */}
      <View className="px-4 py-3 border-t-thin border-outline">
        {/* 文字数カウンター */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-on-surface-variant">
            {content.length} / {maxLength}
          </Text>
          {content.length > maxLength * 0.9 && (
            <Text className="text-xs text-orange-500">
              残り {maxLength - content.length} 文字
            </Text>
          )}
        </View>

        {/* 街選択ボタン（将来実装） */}
        <Pressable
          className="flex-row items-center py-3 border-t-thin border-outline-variant"
          disabled={isSubmitting}
        >
          <Ionicons name="location-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
          <Text className="ml-2 text-sm text-on-surface-variant">
            {selectedMachiId ? '街を選択済み' : '街を選択（任意）'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
