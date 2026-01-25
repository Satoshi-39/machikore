/**
 * タグ入力コンポーネント
 *
 * noteのようなタグ入力UI
 * - Enter/改行でタグを確定
 * - タグはチップとして表示
 * - ×ボタンで削除可能
 */

import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface TagInputProps {
  /** 現在のタグ一覧 */
  tags: string[];
  /** タグが変更された時のコールバック */
  onTagsChange: (tags: string[]) => void;
  /** プレースホルダー */
  placeholder?: string;
  /** 最大タグ数 */
  maxTags?: number;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = 'タグを入力してEnter',
  maxTags = 10,
}: TagInputProps) {
  const isDarkMode = useIsDarkMode();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  // タグを追加（#を除去してクリーンなテキストで保存）
  const addTag = useCallback((tagText: string) => {
    // 先頭の#をすべて除去してトリム
    const cleaned = tagText.replace(/^#+/, '').trim();
    // 空文字チェック
    if (!cleaned) {
      return false;
    }
    // 重複、上限チェック
    if (tags.includes(cleaned) || tags.length >= maxTags) {
      return false;
    }
    onTagsChange([...tags, cleaned]);
    return true;
  }, [tags, onTagsChange, maxTags]);

  // タグを削除
  const removeTag = useCallback((index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onTagsChange(newTags);
  }, [tags, onTagsChange]);

  // 入力確定時の処理
  const handleSubmitEditing = useCallback(() => {
    if (addTag(inputValue)) {
      setInputValue('');
    }
  }, [inputValue, addTag]);

  // テキスト変更時の処理（改行が含まれていたらタグ追加）
  const handleChangeText = useCallback((text: string) => {
    // 改行が含まれている場合（Enterキー押下）
    if (text.includes('\n')) {
      const tagText = text.replace(/\n/g, '');
      if (addTag(tagText)) {
        setInputValue('');
      }
      return;
    }
    setInputValue(text);
  }, [addTag]);

  // コンテナタップで入力欄にフォーカス
  const handleContainerPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const textColor = isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'];
  const placeholderColor = isDarkMode ? colors.gray[500] : colors.gray[400];
  const chipBgColor = isDarkMode ? colors.dark.secondary : colors.gray[100];
  const chipTextColor = isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'];

  return (
    <Pressable
      onPress={handleContainerPress}
      className="bg-surface border border-outline rounded-lg px-3 py-2 min-h-[48px]"
    >
      <View className="flex-row flex-wrap items-center gap-2">
        {/* タグチップ（表示時に#を付ける） */}
        {tags.map((tag, index) => (
          <View
            key={`${tag}-${index}`}
            className="flex-row items-center rounded-full px-3 py-1.5"
            style={{ backgroundColor: chipBgColor }}
          >
            <Text
              className="text-sm mr-1"
              style={{ color: chipTextColor }}
            >
              #{tag}
            </Text>
            <Pressable
              onPress={() => removeTag(index)}
              hitSlop={8}
              className="active:opacity-50"
            >
              <Ionicons
                name="close-circle"
                size={16}
                color={isDarkMode ? colors.gray[400] : colors.gray[500]}
              />
            </Pressable>
          </View>
        ))}

        {/* 入力欄（上限に達していない場合のみ） */}
        {tags.length < maxTags && (
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmitEditing}
            placeholder={tags.length === 0 ? placeholder : ''}
            placeholderTextColor={placeholderColor}
            style={{ color: textColor, minWidth: 100, flex: 1 }}
            className="text-base py-1"
            returnKeyType="done"
            blurOnSubmit={false}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      </View>

      {/* 上限表示 */}
      {tags.length >= maxTags && (
        <Text className="text-xs text-on-surface-variant mt-1">
          タグは最大{maxTags}個までです
        </Text>
      )}
    </Pressable>
  );
}
