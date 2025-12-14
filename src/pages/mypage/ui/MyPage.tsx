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
import { MyPageProfile } from '@/widgets/mypage-profile';
import { MyPageHeader } from '@/widgets/mypage-header';
import { MyPageTabFilter, type MyPageTabMode } from '@/features/filter-mypage-tab';
import { MapsTab } from '@/widgets/mypage-tab-content';
import { useCurrentUserId } from '@/entities/user';

export function MyPage() {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const [tabMode, setTabMode] = useState<MyPageTabMode>('maps');

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleSchedulePress = () => {
    router.push('/schedule');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* ヘッダーバー */}
      <MyPageHeader
        onSettingsPress={handleSettingsPress}
        onSchedulePress={handleSchedulePress}
      />

      {/* プロフィールセクション */}
      <MyPageProfile userId={currentUserId} />

      {/* タブフィルター */}
      <MyPageTabFilter tabMode={tabMode} onTabModeChange={setTabMode} userId={currentUserId} />

      {/* タブコンテンツ（マップ一覧） */}
      <View className="flex-1">
        <MapsTab userId={currentUserId} currentUserId={currentUserId} />
      </View>
    </SafeAreaView>
  );
}
