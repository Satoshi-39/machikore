/**
 * 予定作成フォーム
 *
 * FSDの原則：Features層はユーザーアクションを実現する機能
 */

import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, INPUT_LIMITS } from '@/shared/config';
import { formatLocalDateKey } from '@/shared/lib';
import { Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

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

  const isValid = title.trim().length > 0 && title.length <= INPUT_LIMITS.SCHEDULE_TITLE;

  const handleSubmit = () => {
    if (isValid && !isSubmitting) {
      // 日付を ISO8601 形式に変換（時刻は12:00とする）
      const scheduledAt = `${scheduledDate}T12:00:00.000Z`;
      onSubmit(title.trim(), scheduledAt, memo.trim() || undefined, selectedMachiId);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-outline">
        <Pressable onPress={onCancel} disabled={isSubmitting}>
          <Text className="text-base text-on-surface-variant">キャンセル</Text>
        </Pressable>
        <Text className="text-lg font-semibold">新規予定</Text>
        <Button
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
          size="sm"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ButtonText className={buttonTextVariants({ size: 'sm' })}>作成</ButtonText>
          )}
        </Button>
      </View>

      {/* フォーム */}
      <View className="p-4">
        {/* タイトル */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-on-surface-variant mb-2">
            タイトル <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="例：新宿でランチ"
            placeholderTextColor={colors.light["on-surface-variant"]}
            maxLength={INPUT_LIMITS.SCHEDULE_TITLE}
            editable={!isSubmitting}
            className="border border-outline rounded-lg px-3 py-2 text-base text-on-surface"
            autoFocus
          />
          <Text className="text-xs text-on-surface-variant mt-1">
            {title.length} / {INPUT_LIMITS.SCHEDULE_TITLE}
          </Text>
        </View>

        {/* 日付 */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-on-surface-variant mb-2">
            予定日 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={scheduledDate}
            onChangeText={setScheduledDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.light["on-surface-variant"]}
            editable={!isSubmitting}
            className="border border-outline rounded-lg px-3 py-2 text-base text-on-surface"
          />
          <Text className="text-xs text-on-surface-variant mt-1">
            形式：YYYY-MM-DD（例：2024-12-31）
          </Text>
        </View>

        {/* メモ */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-on-surface-variant mb-2">メモ（任意）</Text>
          <TextInput
            value={memo}
            onChangeText={setMemo}
            placeholder="詳細やメモを入力..."
            placeholderTextColor={colors.light["on-surface-variant"]}
            multiline
            numberOfLines={4}
            maxLength={INPUT_LIMITS.SCHEDULE_MEMO}
            editable={!isSubmitting}
            className="border border-outline rounded-lg px-3 py-2 text-base text-on-surface"
            style={{ textAlignVertical: 'top', minHeight: 100 }}
          />
          <Text className="text-xs text-on-surface-variant mt-1">
            {memo.length} / {INPUT_LIMITS.SCHEDULE_MEMO}
          </Text>
        </View>

        {/* 街選択ボタン（将来実装） */}
        <Pressable
          className="flex-row items-center py-3 border-t border-outline-variant"
          disabled={isSubmitting}
        >
          <Ionicons name="location-outline" size={20} className="text-on-surface-variant" />
          <Text className="ml-2 text-sm text-on-surface-variant">
            {selectedMachiId ? '街を選択済み' : '街を選択（任意）'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
