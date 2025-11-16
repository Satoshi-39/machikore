/**
 * マイページタブフィルター
 *
 * マップ、ブログ、いいね、ブックマークを切り替えるタブUI
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

export type MyPageTabMode = 'maps' | 'blog' | 'likes' | 'bookmarks';

interface MyPageTabFilterProps {
  tabMode: MyPageTabMode;
  onTabModeChange: (mode: MyPageTabMode) => void;
}

export function MyPageTabFilter({
  tabMode,
  onTabModeChange,
}: MyPageTabFilterProps) {
  const tabs: { mode: MyPageTabMode; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'maps', icon: 'map' },
    { mode: 'blog', icon: 'reader' },
    { mode: 'likes', icon: 'heart' },
    { mode: 'bookmarks', icon: 'bookmark' },
  ];

  return (
    <View className="bg-white border-b border-gray-200">
      {/* タブ */}
      <View className="flex-row">
        {tabs.map((tab) => {
          const isActive = tabMode === tab.mode;
          return (
            <Pressable
              key={tab.mode}
              onPress={() => onTabModeChange(tab.mode)}
              className="flex-1 py-3 items-center justify-center"
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={isActive ? colors.primary.DEFAULT : colors.text.secondary}
              />
              {isActive && (
                <View
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                  style={{ backgroundColor: colors.primary.DEFAULT }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
