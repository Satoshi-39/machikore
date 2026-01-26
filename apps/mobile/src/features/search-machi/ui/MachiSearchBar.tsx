/**
 * 街検索バー
 *
 * FSDの原則：Features層のシンプルな検索バー機能
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';

interface MachiSearchBarProps {
  onFocus?: () => void;
}

export function MachiSearchBar({ onFocus }: MachiSearchBarProps) {
  return (
    <Pressable onPress={onFocus}>
      <View className="flex-row items-center bg-surface rounded-lg px-3 py-3 shadow-md">
        <Ionicons name="search" size={iconSizeNum.md} className="text-gray-400" />
        <Text className="flex-1 ml-2 text-base text-on-surface-variant">
          街を検索
        </Text>
      </View>
    </Pressable>
  );
}
