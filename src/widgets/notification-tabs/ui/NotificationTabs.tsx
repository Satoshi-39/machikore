/**
 * 通知タブWidget
 *
 * FSDの原則：Widget層 - ページ固有のタブUI
 * 通知とお知らせを切り替えるタブ
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/config';
import { useUnreadNotificationCount, useUnreadAnnouncementCount } from '@/entities/notification';
import { useUserStore } from '@/entities/user';

export type NotificationTabMode = 'notifications' | 'announcements';

interface NotificationTabsProps {
  tabMode: NotificationTabMode;
  onTabModeChange: (mode: NotificationTabMode) => void;
}

export function NotificationTabs({
  tabMode,
  onTabModeChange,
}: NotificationTabsProps) {
  const user = useUserStore((state) => state.user);
  const { data: notificationCount = 0 } = useUnreadNotificationCount(user?.id);
  const { data: announcementCount = 0 } = useUnreadAnnouncementCount(user?.id);

  const TAB_OPTIONS: { mode: NotificationTabMode; label: string; count: number }[] = [
    { mode: 'notifications', label: '通知', count: notificationCount },
    { mode: 'announcements', label: 'お知らせ', count: announcementCount },
  ];

  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row">
        {TAB_OPTIONS.map((tab) => (
          <Pressable
            key={tab.mode}
            onPress={() => onTabModeChange(tab.mode)}
            className="flex-1 py-4 items-center"
          >
            <View className="flex-row items-center">
              <Text
                className={`text-sm font-semibold ${
                  tabMode === tab.mode ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  className="ml-1.5 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: '#007AFF',
                    minWidth: 18,
                    height: 18,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text className="text-white text-xs font-semibold">
                    {tab.count > 99 ? '99+' : tab.count}
                  </Text>
                </View>
              )}
            </View>
            {tabMode === tab.mode && (
              <View
                className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                style={{ backgroundColor: colors.primary.DEFAULT }}
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
