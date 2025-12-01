/**
 * マイページタブフィルター
 *
 * マップ、ブログを切り替えるタブUI
 * いいね、ブックマークは別ページへ遷移するボタン
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

export type MyPageTabMode = 'maps' | 'blog';

interface MyPageTabFilterProps {
  tabMode: MyPageTabMode;
  onTabModeChange: (mode: MyPageTabMode) => void;
}

export function MyPageTabFilter({
  tabMode,
  onTabModeChange,
}: MyPageTabFilterProps) {
  const router = useRouter();

  const tabs: { mode: MyPageTabMode; icon: keyof typeof Ionicons.glyphMap }[] = [
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
        {/* いいねボタン（マイページタブ内スタック） */}
        <Pressable
          onPress={() => router.push('/(tabs)/mypage/likes')}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons
            name="heart"
            size={24}
            color={colors.text.secondary}
          />
        </Pressable>
        {/* ブックマークボタン（マイページタブ内スタック） */}
        <Pressable
          onPress={() => router.push('/(tabs)/mypage/bookmarks')}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons
            name="bookmark"
            size={24}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>
    </View>
  );
}
