/**
 * サインインページ
 *
 * FSD: pages/auth/ui
 */

import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SignInForm, OAuthButtons } from '@/features/auth';
import { PageHeader } from '@/shared/ui';

interface SignInPageProps {
  onSuccess?: () => void;
  onNavigateToSignUp?: () => void;
}

/**
 * サインインページ
 * Email/Passwordサインイン + OAuth認証ボタンを表示
 */
export function SignInPage({ onSuccess, onNavigateToSignUp }: SignInPageProps) {
  return (
    <View className="flex-1 bg-white">
      <PageHeader title="ログイン" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingVertical: 24 }}>
      {/* OAuth認証ボタン */}
      <OAuthButtons onSuccess={onSuccess} />

      {/* 区切り線 */}
      <View className="flex-row items-center my-6 px-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-sm text-gray-500">または</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Email/Password サインインフォーム */}
      <SignInForm onSuccess={onSuccess} />

      {/* サインアップへの誘導 */}
      {onNavigateToSignUp && (
        <View className="flex-row justify-center items-center mt-6 px-6">
          <Text className="text-gray-600 text-sm">
            アカウントをお持ちでないですか？
          </Text>
          <TouchableOpacity onPress={onNavigateToSignUp}>
            <Text className="text-blue-600 text-sm font-semibold ml-1">
              サインアップ
            </Text>
          </TouchableOpacity>
        </View>
      )}
      </ScrollView>
    </View>
  );
}
