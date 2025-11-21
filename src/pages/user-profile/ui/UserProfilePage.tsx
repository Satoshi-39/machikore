/**
 * ユーザープロフィールページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * URL: /user/:id
 * 他のユーザーのプロフィール、投稿、マップなどを表示
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MyPageProfile } from '@/widgets/mypage-profile';
import { MyPageTabFilter, type MyPageTabMode } from '@/features/filter-mypage-tab';
import { MapsTab, BlogTab, LikesTab, BookmarksTab } from '@/widgets/mypage-tab-content';
import { colors } from '@/shared/config';

export function UserProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tabMode, setTabMode] = useState<MyPageTabMode>('maps');

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* ヘッダーバー（戻るボタンのみ） */}
      <View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-200">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          <Text className="ml-2 text-base font-semibold text-gray-900">
            戻る
          </Text>
        </Pressable>
      </View>

      {/* プロフィールセクション */}
      <MyPageProfile userId={id} />

      {/* タブフィルター */}
      <MyPageTabFilter tabMode={tabMode} onTabModeChange={setTabMode} />

      {/* タブコンテンツ（各タブが独自にスクロール） */}
      <View className="flex-1">
        {tabMode === 'maps' && <MapsTab userId={id} />}
        {tabMode === 'blog' && <BlogTab userId={id} />}
        {tabMode === 'likes' && <LikesTab userId={id} />}
        {tabMode === 'bookmarks' && <BookmarksTab userId={id} />}
      </View>
    </SafeAreaView>
  );
}
