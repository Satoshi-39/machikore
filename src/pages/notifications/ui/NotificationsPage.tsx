/**
 * 通知ページ
 *
 * FSD: pages/notifications/ui
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  NotificationTabs,
  type NotificationTabMode,
} from '@/widgets/notification-tabs';

export function NotificationsPage() {
  const [tabMode, setTabMode] = useState<NotificationTabMode>('notifications');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* タブ */}
      <NotificationTabs tabMode={tabMode} onTabModeChange={setTabMode} />

      {/* 空の状態 */}
      <View className="flex-1 justify-center items-center px-6">
        <Ionicons
          name={
            tabMode === 'notifications'
              ? 'notifications-outline'
              : 'megaphone-outline'
          }
          size={80}
          color="#D1D5DB"
        />
        <Text className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          {tabMode === 'notifications'
            ? '通知はありません'
            : 'お知らせはありません'}
        </Text>
        <Text className="text-base text-gray-500 text-center">
          {tabMode === 'notifications'
            ? 'いいねやコメント、フォローなどの通知がここに表示されます'
            : 'アプリからの重要なお知らせがここに表示されます'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
