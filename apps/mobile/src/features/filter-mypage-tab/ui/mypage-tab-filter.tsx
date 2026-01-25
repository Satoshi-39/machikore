/**
 * マイページタブフィルター
 *
 * マップはタブ内で表示、コレクション・いいね・ブックマークは別ページへ遷移
 */

import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

export type MyPageTabMode = 'maps';

interface MyPageTabFilterProps {
  tabMode: MyPageTabMode;
  onTabModeChange: (mode: MyPageTabMode) => void;
  /** 表示対象のユーザーID（他ユーザーのプロフィール用） */
  userId?: string;
}

export function MyPageTabFilter({
  tabMode,
  onTabModeChange,
  userId,
}: MyPageTabFilterProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();

  // アクティブ/非アクティブのアイコン色
  const activeColor = colors.light.primary;
  const inactiveColor = colors.light["on-surface-variant"];

  // userIdがある場合は他ユーザーのプロフィール画面からの遷移
  const basePath = userId
    ? `/(tabs)/${currentTab}/users/${userId}`
    : `/(tabs)/${currentTab}`;

  return (
    <View className="bg-surface border-b border-outline">
      {/* タブ */}
      <View className="flex-row">
        {/* マップタブ（タブ切り替え） */}
        <Pressable
          onPress={() => onTabModeChange('maps')}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons
            name="map"
            size={24}
            color={tabMode === 'maps' ? activeColor : inactiveColor}
          />
          {tabMode === 'maps' && (
            <View
              className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
              style={{ backgroundColor: activeColor }}
            />
          )}
        </Pressable>
        {/* コレクションボタン（別ページへ遷移） */}
        <Pressable
          onPress={() => router.push(`${basePath}/collections` as Href)}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons name="grid" size={24} color={inactiveColor} />
        </Pressable>
        {/* いいねボタン（別ページへ遷移） */}
        <Pressable
          onPress={() => router.push(`${basePath}/likes` as Href)}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons name="heart" size={24} color={inactiveColor} />
        </Pressable>
        {/* ブックマークボタン（別ページへ遷移） */}
        <Pressable
          onPress={() => router.push(`/(tabs)/${currentTab}/bookmarks` as Href)}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons name="bookmark" size={24} color={inactiveColor} />
        </Pressable>
      </View>
    </View>
  );
}
