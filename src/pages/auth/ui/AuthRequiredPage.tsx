/**
 * 認証要求ページ（モーダル）
 *
 * 認証が必要な機能にアクセスした際に表示される
 * シンプルに「アカウント作成」「ログイン」の選択肢を提示
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AuthRequiredPageProps {
  onSignUpPress?: () => void;
  onSignInPress?: () => void;
  message?: string;
}

export function AuthRequiredPage({
  onSignUpPress,
  onSignInPress,
  message = 'この機能を利用するにはログインが必要です',
}: AuthRequiredPageProps) {
  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      {/* アイコン */}
      <View className="mb-6">
        <Ionicons name="lock-closed-outline" size={64} color="#9ca3af" />
      </View>

      {/* メッセージ */}
      <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
        ログインが必要です
      </Text>
      <Text className="text-base text-gray-600 mb-8 text-center">
        {message}
      </Text>

      {/* アカウント作成ボタン */}
      <TouchableOpacity
        onPress={onSignUpPress}
        className="bg-blue-600 py-4 px-8 rounded-lg w-full max-w-sm mb-3"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-semibold text-base">
          アカウントを作成
        </Text>
      </TouchableOpacity>

      {/* ログインボタン */}
      <TouchableOpacity
        onPress={onSignInPress}
        className="bg-white border border-gray-300 py-4 px-8 rounded-lg w-full max-w-sm"
        activeOpacity={0.8}
      >
        <Text className="text-gray-700 text-center font-semibold text-base">
          ログイン
        </Text>
      </TouchableOpacity>
    </View>
  );
}
