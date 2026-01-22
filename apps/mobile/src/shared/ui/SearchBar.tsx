/**
 * 検索バーコンポーネント
 *
 * FSD: shared/ui - 汎用的な検索入力UI
 */

import React from 'react';
import { View, Pressable, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  showCancelButton?: boolean;
}

export function SearchBar({
  placeholder = '検索...',
  value = '',
  onChangeText,
  onCancel,
  autoFocus = false,
  showCancelButton = false,
}: SearchBarProps) {
  const isDarkMode = useIsDarkMode();

  return (
    <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-5 py-3">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center bg-muted dark:bg-dark-muted rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <TextInput
            className="flex-1 ml-2 text-base text-foreground dark:text-dark-foreground"
            placeholder={placeholder}
            placeholderTextColor={colors.gray[400]}
            value={value}
            onChangeText={onChangeText}
            autoFocus={autoFocus}
          />
          {value && value.length > 0 && (
            <Pressable onPress={() => onChangeText?.('')} className="p-1">
              <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
            </Pressable>
          )}
        </View>
        {showCancelButton && onCancel && (
          <Pressable onPress={onCancel}>
            <Text
              className="text-base font-medium"
              style={{ color: isDarkMode ? colors.dark.foreground : colors.primary.dark }}
            >
              キャンセル
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
