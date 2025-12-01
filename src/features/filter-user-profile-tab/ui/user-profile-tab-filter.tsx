/**
 * ユーザープロフィールページ用タブフィルター
 *
 * マップ、ブログを切り替えるタブUI
 * いいねは別ページへ遷移するボタン
 * （他のユーザーのブックマークは表示しない）
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

export type UserProfileTabMode = 'maps' | 'blog';

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
  const segments = useSegments();

  // タブ内かどうかを判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';

  const handleLikesPress = () => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/users/${userId}/likes`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/users/${userId}/likes`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/users/${userId}/likes`);
    } else {
      router.push(`/users/${userId}/likes`);
    }
  };

  const tabs: { mode: UserProfileTabMode; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'maps', icon: 'map' },
    { mode: 'blog', icon: 'reader' },
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
        {/* いいねボタン（別ページへ遷移） */}
        <Pressable
          onPress={handleLikesPress}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons
            name="heart"
            size={24}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>
    </View>
  );
}
