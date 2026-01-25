/**
 * セレクトフィールド
 *
 * ドロップダウン式の選択フィールド
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectFieldProps {
  label: string;
  value: string | null;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
}

export function SelectField({
  label,
  value,
  placeholder,
  onPress,
  disabled = false,
}: SelectFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-on-surface-variant mb-2">
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`flex-row items-center justify-between px-4 py-3 border rounded-lg ${
          disabled
            ? 'bg-secondary border-outline-variant'
            : 'bg-surface border-outline'
        }`}
      >
        <Text
          className={`text-base ${
            value
              ? 'text-on-surface'
              : 'text-on-surface-variant'
          }`}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? '#9CA3AF' : '#6B7280'}
        />
      </Pressable>
    </View>
  );
}
