/**
 * ユーザープロフィールページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * URL: /user/:id
 * ユーザーのプロフィール、投稿、マップなどを表示
 * 自分自身の場合はブックマークタブも表示
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MyPageProfile } from '@/widgets/mypage-profile';
import { MyPageTabFilter, type MyPageTabMode } from '@/features/filter-mypage-tab';
import { UserProfileTabFilter, type UserProfileTabMode } from '@/features/filter-user-profile-tab';
import { MapsTab, BlogTab } from '@/widgets/mypage-tab-content';
import { useCurrentUserId } from '@/entities/user';

export function UserProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const isOwner = currentUserId === id;

  // 自分の場合はMyPageTabMode、他人の場合はUserProfileTabMode
  const [tabMode, setTabMode] = useState<MyPageTabMode | UserProfileTabMode>('maps');

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* カスタムヘッダー */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900">プロフィール</Text>
      </View>

      {/* プロフィールセクション */}
      <MyPageProfile userId={id} />

      {/* タブフィルター（自分の場合はブックマーク付き） */}
      {isOwner ? (
        <MyPageTabFilter
          tabMode={tabMode as MyPageTabMode}
          onTabModeChange={setTabMode}
        />
      ) : (
        <UserProfileTabFilter
          tabMode={tabMode as UserProfileTabMode}
          onTabModeChange={setTabMode}
        />
      )}

      {/* タブコンテンツ（各タブが独自にスクロール） */}
      <View className="flex-1">
        {tabMode === 'maps' && <MapsTab userId={id} />}
        {tabMode === 'blog' && <BlogTab userId={id} />}
      </View>
    </SafeAreaView>
  );
}
