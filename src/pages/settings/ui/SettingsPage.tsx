/**
 * 設定ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useSignOut } from '@/features/auth';

interface SettingsPageProps {
  onSignOutSuccess?: () => void;
}

export function SettingsPage({ onSignOutSuccess }: SettingsPageProps) {
  const { signOut, isLoading } = useSignOut();

  const handleSignOutPress = () => {
    Alert.alert(
      'サインアウト',
      'サインアウトしてもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'サインアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              onSignOutSuccess?.();
            } catch (error) {
              // エラーはuseSignOutで処理済み
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* プレースホルダーセクション */}
        <View className="bg-white mt-4 px-4 py-6">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            今後実装予定の機能
          </Text>
          <Text className="text-sm text-gray-500">
            {'\u2022'} プロフィール編集{'\n'}
            {'\u2022'} 通知設定{'\n'}
            {'\u2022'} プライバシー設定{'\n'}
            {'\u2022'} アカウント管理
          </Text>
        </View>

        {/* サインアウトセクション */}
        <View className="bg-white mt-4 px-4 py-6">
          <Pressable
            onPress={handleSignOutPress}
            disabled={isLoading}
            className="bg-red-600 py-3 px-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              {isLoading ? 'サインアウト中...' : 'サインアウト'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
