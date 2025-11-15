/**
 * 通知ページ
 *
 * FSD: pages/notifications/ui
 */

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export function NotificationsPage() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ヘッダー */}
      <View className="px-5 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">通知</Text>
      </View>

      {/* 空の状態 */}
      <View className="flex-1 justify-center items-center px-6">
        <Ionicons name="notifications-outline" size={80} color="#D1D5DB" />
        <Text className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          通知はありません
        </Text>
        <Text className="text-base text-gray-500 text-center">
          いいねやコメント、フォローなどの通知がここに表示されます
        </Text>
      </View>
    </SafeAreaView>
  );
}
