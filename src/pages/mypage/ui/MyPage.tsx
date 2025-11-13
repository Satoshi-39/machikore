/**
 * マイページ（認証済みユーザー専用）
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * 認証済みユーザーのプロフィール、統計、友達などを表示
 */

import React from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileSection } from '@/widgets/profile-section';
import { MyPageHeader } from '@/features/mypage';
import { useSignOut } from '@/features/auth';
import { useCurrentUserId } from '@/entities/user';
import { TouchableOpacity } from 'react-native';

export function MyPage() {
  const currentUserId = useCurrentUserId();
  const { signOut, isLoading } = useSignOut();

  const handleSettingsPress = () => {
    Alert.alert('設定', '設定画面は今後実装予定です');
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
      <MyPageHeader onSettingsPress={handleSettingsPress} />

      <ScrollView className="flex-1">
        {/* プロフィールセクション */}
        <ProfileSection userId={currentUserId} />

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

        {/* 友達（将来実装） */}
        <View className="bg-white py-6 px-4 mt-2">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            友達
          </Text>
          <Text className="text-sm text-gray-500">
            友達機能は今後実装予定です
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
