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
      <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`flex-row items-center justify-between px-4 py-3 border rounded-lg ${
          disabled
            ? 'bg-muted dark:bg-dark-muted border-border-light dark:border-dark-border-light'
            : 'bg-surface dark:bg-dark-surface border-border dark:border-dark-border'
        }`}
      >
        <Text
          className={`text-base ${
            value
              ? 'text-foreground dark:text-dark-foreground'
              : 'text-foreground-muted dark:text-dark-foreground-muted'
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
