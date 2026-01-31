/**
 * 認証誘導ページ
 *
 * 匿名ユーザー向けのウェルカムページ
 * サインアップ・サインインへの誘導を行う
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface AuthInvitationPageProps {
  onSignInPress?: () => void;
  onSignUpPress?: () => void;
}

export function AuthInvitationPage({
  onSignInPress,
  onSignUpPress,
}: AuthInvitationPageProps) {
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']} testID="auth-invitation-screen">
      {/* 上部: アイコンとテキスト */}
      <View className="flex-1 justify-center items-center px-6 pt-16">
        {/* アイコン */}
        <View className="mb-8">
          <Ionicons name="location-outline" size={80} color={themeColors.primary} />
        </View>

        {/* タイトル */}
        <Text className="text-3xl font-bold text-on-surface mb-4 text-center">
          街コレへようこそ
        </Text>

        {/* 説明 */}
        <Text className="text-base text-on-surface-variant text-center leading-relaxed">
          お気に入りの場所を集めて共有しよう
        </Text>
      </View>

      {/* 下部: ボタン */}
      <View className="px-8 pb-16">
        {/* サインアップボタン（メイン） */}
        <TouchableOpacity
          onPress={onSignUpPress}
          className="bg-primary py-4 px-8 rounded-lg w-full mb-4"
          activeOpacity={0.8}
        >
          <Text className="text-on-primary text-center font-semibold text-lg">
            アカウントを作成
          </Text>
        </TouchableOpacity>

        {/* サインインボタン（サブ） */}
        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-surface-variant border-thin border-outline py-4 px-8 rounded-lg w-full mb-4"
          activeOpacity={0.8}
        >
          <Text className="text-on-surface-variant text-center font-semibold text-lg">
            ログイン
          </Text>
        </TouchableOpacity>

        {/* フッター情報 */}
        <Text className="text-sm text-on-surface-variant text-center mt-8">
          現在はゲストとして利用中です
        </Text>
      </View>
    </SafeAreaView>
  );
}
