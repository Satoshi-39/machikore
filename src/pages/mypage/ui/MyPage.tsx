/**
 * マイページ（認証済みユーザー専用）
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * 認証済みユーザーのプロフィール、統計、友達などを表示
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProfileSection } from '@/widgets/profile-section';
import { MyPageHeader } from '@/widgets/mypage-header';
import { MyPageTabFilter, type MyPageTabMode } from '@/features/filter-mypage-tab';
import { MapsTab, LikesTab, BookmarksTab, VisitsTab } from '@/widgets/mypage-tab-content';
import { useCurrentUserId } from '@/entities/user';
import { useRecentVisits } from '@/entities/visit/api';

export function MyPage() {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const [tabMode, setTabMode] = useState<MyPageTabMode>('maps');

  // 訪問した街データ取得
  const { data: recentVisits = [] } = useRecentVisits(currentUserId ?? '', 20);

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleSchedulePress = () => {
    router.push('/schedule');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* ヘッダーバー */}
      <MyPageHeader
        onSettingsPress={handleSettingsPress}
        onSchedulePress={handleSchedulePress}
      />

      {/* プロフィールセクション */}
      <ProfileSection userId={currentUserId} />

      {/* タブフィルター */}
      <MyPageTabFilter tabMode={tabMode} onTabModeChange={setTabMode} />

      {/* タブコンテンツ（各タブが独自にスクロール） */}
      <View className="flex-1">
        {tabMode === 'maps' && <MapsTab userId={currentUserId} />}
        {tabMode === 'visits' && <VisitsTab visits={recentVisits} />}
        {tabMode === 'likes' && <LikesTab userId={currentUserId} />}
        {tabMode === 'bookmarks' && <BookmarksTab userId={currentUserId} />}
      </View>
    </SafeAreaView>
  );
}
