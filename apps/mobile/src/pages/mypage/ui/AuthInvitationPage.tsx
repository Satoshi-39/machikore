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

interface AuthInvitationPageProps {
  onSignInPress?: () => void;
  onSignUpPress?: () => void;
}

export function AuthInvitationPage({
  onSignInPress,
  onSignUpPress,
}: AuthInvitationPageProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface-variant" edges={['top']}>
      <View className="flex-1 justify-center items-center px-6">
        {/* アイコン */}
        <View className="mb-8">
          <Ionicons name="location-outline" size={80} color={colors.light.primary} />
        </View>

        {/* タイトル */}
        <Text className="text-3xl font-bold text-on-surface mb-4 text-center">
          街コレへようこそ
        </Text>

        {/* 説明 */}
        <Text className="text-base text-on-surface-variant mb-8 text-center leading-relaxed">
          訪れた街を記録し、思い出を残しましょう。{'\n'}
          アカウントを作成すると、すべての機能が利用できます。
        </Text>

        {/* サインアップボタン（メイン） */}
        <TouchableOpacity
          onPress={onSignUpPress}
          className="bg-blue-600 py-4 px-8 rounded-lg w-full max-w-sm mb-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-semibold text-lg">
            アカウントを作成
          </Text>
        </TouchableOpacity>

        {/* サインインボタン（サブ） */}
        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-surface border border-outline py-4 px-8 rounded-lg w-full max-w-sm"
          activeOpacity={0.8}
        >
          <Text className="text-on-surface-variant text-center font-semibold text-lg">
            ログイン
          </Text>
        </TouchableOpacity>

        {/* フッター情報 */}
        <View className="mt-12">
          <Text className="text-sm text-on-surface-variant text-center">
            現在はゲストとして利用中です
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
