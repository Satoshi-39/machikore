/**
 * ブックマークタブフィルター
 *
 * スポット/マップを切り替えるタブUI
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

export type BookmarkTabMode = 'spots' | 'maps';

interface BookmarkTabFilterProps {
  tabMode: BookmarkTabMode;
  onTabModeChange: (mode: BookmarkTabMode) => void;
}

export function BookmarkTabFilter({
  tabMode,
  onTabModeChange,
}: BookmarkTabFilterProps) {
  return (
    <View className="bg-white border-b border-gray-200 flex-row">
      <Pressable
        onPress={() => onTabModeChange('spots')}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-base font-medium ${
            tabMode === 'spots' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          スポット
        </Text>
        {tabMode === 'spots' && (
          <View className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
        )}
      </Pressable>
      <Pressable
        onPress={() => onTabModeChange('maps')}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-base font-medium ${
            tabMode === 'maps' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          マップ
        </Text>
        {tabMode === 'maps' && (
          <View className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
        )}
      </Pressable>
    </View>
  );
}
