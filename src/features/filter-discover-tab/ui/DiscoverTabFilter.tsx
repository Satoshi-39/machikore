/**
 * 発見タブのタブフィルター
 *
 * FSDの原則：Feature層 - ユーザーのアクション（タブ切り替え）
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type DiscoverTabMode = 'spots' | 'maps';

interface DiscoverTabFilterProps {
  tabMode: DiscoverTabMode;
  onTabModeChange: (mode: DiscoverTabMode) => void;
}

const TAB_OPTIONS: { mode: DiscoverTabMode; label: string }[] = [
  { mode: 'spots', label: 'スポット' },
  { mode: 'maps', label: 'マップ' },
];

export function DiscoverTabFilter({ tabMode, onTabModeChange }: DiscoverTabFilterProps) {
  return (
    <View className="flex-row px-4 py-2 bg-white border-b border-gray-100">
      {TAB_OPTIONS.map((option) => {
        const isActive = tabMode === option.mode;
        return (
          <TouchableOpacity
            key={option.mode}
            onPress={() => onTabModeChange(option.mode)}
            className={`px-4 py-2 mr-2 rounded-full ${
              isActive ? 'bg-blue-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isActive ? 'text-white' : 'text-gray-600'
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
