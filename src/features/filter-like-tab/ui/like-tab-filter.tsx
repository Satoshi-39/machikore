/**
 * いいねタブフィルター
 *
 * スポット/マップを切り替えるタブUI
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

export type LikeTabMode = 'spots' | 'maps';

interface LikeTabFilterProps {
  tabMode: LikeTabMode;
  onTabModeChange: (mode: LikeTabMode) => void;
}

export function LikeTabFilter({
  tabMode,
  onTabModeChange,
}: LikeTabFilterProps) {
  return (
    <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border flex-row">
      <Pressable
        onPress={() => onTabModeChange('spots')}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-base font-medium ${
            tabMode === 'spots' ? 'text-blue-500' : 'text-foreground-secondary dark:text-dark-foreground-secondary'
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
            tabMode === 'maps' ? 'text-blue-500' : 'text-foreground-secondary dark:text-dark-foreground-secondary'
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
