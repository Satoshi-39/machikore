/**
 * サインアップページ
 *
 * FSD: pages/auth/ui
 */

import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SignUpForm, OAuthButtons } from '@/features/auth';
import { PageHeader } from '@/shared/ui';

interface SignUpPageProps {
  onSuccess?: () => void;
  onNavigateToSignIn?: () => void;
}

/**
 * サインアップページ
 * SignUpFormフィーチャーを使用してサインアップ画面を構成
 */
export function SignUpPage({ onSuccess, onNavigateToSignIn }: SignUpPageProps) {
  return (
    <View className="flex-1 bg-white">
      <PageHeader title="アカウント作成" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingVertical: 24 }}>
      {/* OAuth認証ボタン */}
      <OAuthButtons onSuccess={onSuccess} />

      {/* 区切り線 */}
      <View className="flex-row items-center my-6 px-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-sm text-gray-500">または</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Email/Password サインアップフォーム */}
      <SignUpForm onSuccess={onSuccess} />

      {/* サインインへの誘導 */}
      {onNavigateToSignIn && (
        <View className="flex-row justify-center items-center mt-6 px-6">
          <Text className="text-gray-600 text-sm">
            すでにアカウントをお持ちですか？
          </Text>
          <TouchableOpacity onPress={onNavigateToSignIn}>
            <Text className="text-blue-600 text-sm font-semibold ml-1">
              サインイン
            </Text>
          </TouchableOpacity>
        </View>
      )}
      </ScrollView>
    </View>
  );
}
