/**
 * 投稿作成フォーム
 *
 * FSDの原則：Features層はユーザーアクションを実現する機能
 */

import React, { useState } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

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
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border dark:border-dark-border">
        <Pressable onPress={onCancel} disabled={isSubmitting}>
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary">キャンセル</Text>
        </Pressable>
        <Text className="text-lg font-semibold">新規投稿</Text>
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={`px-4 py-2 rounded-full ${
            isValid && !isSubmitting ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <Text className={`text-sm font-semibold ${
            isValid && !isSubmitting ? 'text-white' : 'text-foreground-secondary dark:text-dark-foreground-secondary'
          }`}>
            {isSubmitting ? '投稿中...' : '投稿'}
          </Text>
        </Pressable>
      </View>

      {/* 本文入力 */}
      <View className="flex-1 p-4">
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="今日はどこに行きましたか？"
          placeholderTextColor={colors.text.placeholder}
          multiline
          maxLength={maxLength}
          editable={!isSubmitting}
          className="flex-1 text-base text-foreground dark:text-dark-foreground"
          style={{ textAlignVertical: 'top' }}
          autoFocus
        />
      </View>

      {/* フッター */}
      <View className="px-4 py-3 border-t border-border dark:border-dark-border">
        {/* 文字数カウンター */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
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
          className="flex-row items-center py-3 border-t border-border-light dark:border-dark-border-light"
          disabled={isSubmitting}
        >
          <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
          <Text className="ml-2 text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
            {selectedMachiId ? '街を選択済み' : '街を選択（任意）'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
