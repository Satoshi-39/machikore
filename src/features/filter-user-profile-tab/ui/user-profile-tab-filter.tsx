/**
 * ユーザープロフィールページ用タブフィルター
 *
 * マップ、ブログ、いいねを切り替えるタブUI
 * （他のユーザーのブックマークは表示しない）
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

export type UserProfileTabMode = 'maps' | 'blog' | 'likes';

interface UserProfileTabFilterProps {
  tabMode: UserProfileTabMode;
  onTabModeChange: (mode: UserProfileTabMode) => void;
}

export function UserProfileTabFilter({
  tabMode,
  onTabModeChange,
}: UserProfileTabFilterProps) {
  const tabs: { mode: UserProfileTabMode; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'maps', icon: 'map' },
    { mode: 'blog', icon: 'reader' },
    { mode: 'likes', icon: 'heart' },
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
