/**
 * 検索バーコンポーネント
 *
 * FSD: shared/ui - 汎用的な検索入力UI
 */

import React from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

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
  return (
    <View className="bg-white border-b border-gray-200 px-5 py-3">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
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
            <Text className="text-base text-blue-600 font-medium">キャンセル</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
