/**
 * マイページタブフィルター
 *
 * マップはタブ内で表示、コレクション・いいね・ブックマークは別ページへ遷移
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';

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

  // userIdがある場合は他ユーザーのプロフィール画面からの遷移
  const basePath = userId
    ? `/(tabs)/${currentTab}/users/${userId}`
    : `/(tabs)/${currentTab}`;

  return (
    <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border">
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
            color={tabMode === 'maps' ? colors.primary.DEFAULT : colors.text.secondary}
          />
          {tabMode === 'maps' && (
            <View
              className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
              style={{ backgroundColor: colors.primary.DEFAULT }}
            />
          )}
        </Pressable>
        {/* コレクションボタン（別ページへ遷移） */}
        <Pressable
          onPress={() => router.push(`${basePath}/collections` as any)}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons
            name="library"
            size={24}
            color={colors.text.secondary}
          />
        </Pressable>
        {/* いいねボタン（別ページへ遷移） */}
        <Pressable
          onPress={() => router.push(`${basePath}/likes` as any)}
          className="flex-1 py-3 items-center justify-center"
        >
          <Ionicons
            name="heart"
            size={24}
            color={colors.text.secondary}
          />
        </Pressable>
        {/* ブックマークボタン（別ページへ遷移） */}
        <Pressable
          onPress={() => router.push(`${basePath}/bookmarks` as any)}
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
