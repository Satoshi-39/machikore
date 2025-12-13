/**
 * ユーザープロフィールページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * URL: /user/:id
 * ユーザーのプロフィール、投稿、マップなどを表示
 * 自分自身の場合はブックマークタブも表示
 */

import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MyPageProfile } from '@/widgets/mypage-profile';
import { MyPageTabFilter, type MyPageTabMode } from '@/features/filter-mypage-tab';
import { UserProfileTabFilter, type UserProfileTabMode } from '@/features/filter-user-profile-tab';
import { MapsTab, CollectionsTab } from '@/widgets/mypage-tab-content';
import { useCurrentUserId } from '@/entities/user';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';

export function UserProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const isOwner = currentUserId === id;

  // 自分の場合はMyPageTabMode、他人の場合はUserProfileTabMode
  const [tabMode, setTabMode] = useState<MyPageTabMode | UserProfileTabMode>('maps');

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleSchedulePress = () => {
    router.push('/schedule');
  };

  // 自分のプロフィールの場合は設定・スケジュールボタンを表示
  const rightComponent = isOwner ? (
    <View className="flex-row gap-2">
      <Pressable
        onPress={handleSchedulePress}
        className="w-10 h-10 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
      >
        <Ionicons name="calendar-outline" size={24} color={colors.text.secondary} />
      </Pressable>
      <Pressable
        onPress={handleSettingsPress}
        className="w-10 h-10 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
      >
        <Ionicons name="settings-outline" size={24} color={colors.text.secondary} />
      </Pressable>
    </View>
  ) : undefined;

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader title="プロフィール" rightComponent={rightComponent} />

      {/* プロフィールセクション */}
      <MyPageProfile userId={id} />

      {/* タブフィルター（自分の場合はブックマーク付き） */}
      {isOwner ? (
        <MyPageTabFilter
          tabMode={tabMode as MyPageTabMode}
          onTabModeChange={setTabMode}
          userId={id}
        />
      ) : (
        <UserProfileTabFilter
          tabMode={tabMode as UserProfileTabMode}
          onTabModeChange={setTabMode}
          userId={id}
        />
      )}

      {/* タブコンテンツ（各タブが独自にスクロール） */}
      <View className="flex-1">
        {tabMode === 'maps' && <MapsTab userId={id} currentUserId={currentUserId} />}
        {tabMode === 'collections' && <CollectionsTab userId={id} />}
      </View>
    </View>
  );
}
