/**
 * ユーザープロフィールページ用タブフィルター
 *
 * マップ、コレクションを切り替えるタブUI
 * いいねは別ページへ遷移するボタン
 * （他のユーザーのブックマークは表示しない）
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';

export type UserProfileTabMode = 'maps' | 'collections';

interface UserProfileTabFilterProps {
  tabMode: UserProfileTabMode;
  onTabModeChange: (mode: UserProfileTabMode) => void;
  userId: string;
}

export function UserProfileTabFilter({
  tabMode,
  onTabModeChange,
  userId,
}: UserProfileTabFilterProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();

  const handleLikesPress = () => {
    router.push(`/(tabs)/${currentTab}/users/${userId}/likes` as Href);
  };

  const tabs: { mode: UserProfileTabMode; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'maps', icon: 'map' },
    { mode: 'collections', icon: 'grid' },
  ];

  return (
    <View className="bg-surface border-b border-outline">
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
                color={isActive ? colors.light.primary : colors.light["on-surface-variant"]}
              />
              {isActive && (
                <View
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                  style={{ backgroundColor: colors.light.primary }}
                />
              )}
            </Pressable>
          );
        })}
        {/* いいねボタン（別ページへ遷移） */}
        <Pressable
          onPress={handleLikesPress}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons
            name="heart"
            size={24}
            className="text-on-surface-variant"
          />
        </Pressable>
      </View>
    </View>
  );
}
