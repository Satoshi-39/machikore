/**
 * マップ検索バー
 *
 * FSDの原則：Features層のシンプルな検索バー機能
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MapSearchBarProps {
  onFocus?: () => void;
  variant?: 'map' | 'list';
}

export function MapSearchBar({ onFocus, variant = 'map' }: MapSearchBarProps) {
  return (
    <Pressable onPress={onFocus}>
      <View
        className={`flex-row items-center rounded-lg px-3 py-3 ${
          variant === 'map' ? 'bg-white shadow-md' : 'bg-gray-100'
        }`}
      >
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <Text className="flex-1 ml-2 text-base text-gray-400">
          スポットを検索
        </Text>
      </View>
    </Pressable>
  );
}
