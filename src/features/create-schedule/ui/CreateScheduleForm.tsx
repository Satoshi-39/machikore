/**
 * 予定作成フォーム
 *
 * FSDの原則：Features層はユーザーアクションを実現する機能
 */

import React, { useState } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { formatLocalDateKey } from '@/shared/lib';

interface CreateScheduleFormProps {
  onSubmit: (title: string, scheduledAt: string, memo?: string, machiId?: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CreateScheduleForm({
  onSubmit,
  onCancel,
  isSubmitting = false
}: CreateScheduleFormProps) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    formatLocalDateKey(new Date())
  );
  const [selectedMachiId] = useState<string | undefined>(); // TODO: 街選択機能実装時に使用

  const maxTitleLength = 100;
  const maxMemoLength = 500;
  const isValid = title.trim().length > 0 && title.length <= maxTitleLength;

  const handleSubmit = () => {
    if (isValid && !isSubmitting) {
      // 日付を ISO8601 形式に変換（時刻は12:00とする）
      const scheduledAt = `${scheduledDate}T12:00:00.000Z`;
      onSubmit(title.trim(), scheduledAt, memo.trim() || undefined, selectedMachiId);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <Pressable onPress={onCancel} disabled={isSubmitting}>
          <Text className="text-base text-gray-600">キャンセル</Text>
        </Pressable>
        <Text className="text-lg font-semibold">新規予定</Text>
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={`px-4 py-2 rounded-full ${
            isValid && !isSubmitting ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <Text className={`text-sm font-semibold ${
            isValid && !isSubmitting ? 'text-white' : 'text-gray-500'
          }`}>
            {isSubmitting ? '作成中...' : '作成'}
          </Text>
        </Pressable>
      </View>

      {/* フォーム */}
      <View className="p-4">
        {/* タイトル */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            タイトル <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="例：新宿でランチ"
            placeholderTextColor={colors.text.placeholder}
            maxLength={maxTitleLength}
            editable={!isSubmitting}
            className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900"
            autoFocus
          />
          <Text className="text-xs text-gray-500 mt-1">
            {title.length} / {maxTitleLength}
          </Text>
        </View>

        {/* 日付 */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            予定日 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={scheduledDate}
            onChangeText={setScheduledDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.text.placeholder}
            editable={!isSubmitting}
            className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900"
          />
          <Text className="text-xs text-gray-500 mt-1">
            形式：YYYY-MM-DD（例：2024-12-31）
          </Text>
        </View>

        {/* メモ */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">メモ（任意）</Text>
          <TextInput
            value={memo}
            onChangeText={setMemo}
            placeholder="詳細やメモを入力..."
            placeholderTextColor={colors.text.placeholder}
            multiline
            numberOfLines={4}
            maxLength={maxMemoLength}
            editable={!isSubmitting}
            className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900"
            style={{ textAlignVertical: 'top', minHeight: 100 }}
          />
          <Text className="text-xs text-gray-500 mt-1">
            {memo.length} / {maxMemoLength}
          </Text>
        </View>

        {/* 街選択ボタン（将来実装） */}
        <Pressable
          className="flex-row items-center py-3 border-t border-gray-100"
          disabled={isSubmitting}
        >
          <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
          <Text className="ml-2 text-sm text-gray-600">
            {selectedMachiId ? '街を選択済み' : '街を選択（任意）'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
