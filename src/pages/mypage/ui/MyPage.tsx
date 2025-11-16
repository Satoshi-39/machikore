/**
 * マイページ（認証済みユーザー専用）
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * 認証済みユーザーのプロフィール、統計、友達などを表示
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProfileSection } from '@/widgets/profile-section';
import { MyPageHeader } from '@/widgets/mypage-header';
import { MyPageTabFilter, type MyPageTabMode } from '@/features/filter-mypage-tab';
import { UserMapList } from '@/widgets/user-map-list';
import { UserLikes } from '@/widgets/user-likes';
import { UserBookmarks } from '@/widgets/user-bookmarks';
import { RecentVisits } from '@/widgets/recent-visits';
import { useSignOut } from '@/features/auth';
import { useCurrentUserId } from '@/entities/user';
import { useRecentVisits } from '@/entities/visit/api';
import { TouchableOpacity } from 'react-native';

export function MyPage() {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { signOut, isLoading } = useSignOut();
  const [tabMode, setTabMode] = useState<MyPageTabMode>('maps');

  // 訪問した街データ取得
  const { data: recentVisits = [] } = useRecentVisits(currentUserId ?? '', 20);

  const handleSettingsPress = () => {
    Alert.alert('設定', '設定画面は今後実装予定です');
  };

  const handleSchedulePress = () => {
    router.push('/schedule');
  };

  const handleSignOutPress = () => {
    Alert.alert(
      'サインアウト',
      'サインアウトしてもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'サインアウト',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* ヘッダーバー */}
      <MyPageHeader
        onSettingsPress={handleSettingsPress}
        onSchedulePress={handleSchedulePress}
      />

      <ScrollView className="flex-1">
        {/* プロフィールセクション */}
        <ProfileSection userId={currentUserId} />

        {/* タブフィルター */}
        <MyPageTabFilter tabMode={tabMode} onTabModeChange={setTabMode} />

        {/* タブコンテンツ */}
        <View className="flex-1">
          {tabMode === 'maps' && <UserMapList userId={currentUserId} />}
          {tabMode === 'visits' && <RecentVisits visits={recentVisits} />}
          {tabMode === 'likes' && <UserLikes userId={currentUserId} />}
          {tabMode === 'bookmarks' && <UserBookmarks userId={currentUserId} />}
        </View>

        {/* サインアウトセクション */}
        <View className="bg-white py-6 px-4 mt-2">
          <TouchableOpacity
            onPress={handleSignOutPress}
            disabled={isLoading}
            className="bg-red-600 py-3 px-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold">
              {isLoading ? 'サインアウト中...' : 'サインアウト'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
