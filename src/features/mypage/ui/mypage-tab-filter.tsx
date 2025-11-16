/**
 * マイページタブフィルター
 *
 * マップ、スケジュール、訪問した街を切り替えるタブUI
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/config';

export type MyPageTabMode = 'maps' | 'schedule' | 'visits';

interface MyPageTabFilterProps {
  tabMode: MyPageTabMode;
  onTabModeChange: (mode: MyPageTabMode) => void;
}

export function MyPageTabFilter({
  tabMode,
  onTabModeChange,
}: MyPageTabFilterProps) {
  const tabs: { mode: MyPageTabMode; label: string }[] = [
    { mode: 'maps', label: 'マップ' },
    { mode: 'schedule', label: 'スケジュール' },
    { mode: 'visits', label: '訪問した街' },
  ];

  return (
    <View className="bg-white border-b border-gray-200">
      {/* タブ */}
      <View className="flex-row">
        {tabs.map((tab) => (
          <Pressable
            key={tab.mode}
            onPress={() => onTabModeChange(tab.mode)}
            className="flex-1 py-4 items-center"
          >
            <Text
              className={`text-sm font-semibold ${
                tabMode === tab.mode ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
            {tabMode === tab.mode && (
              <View
                className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                style={{ backgroundColor: colors.primary.DEFAULT }}
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
