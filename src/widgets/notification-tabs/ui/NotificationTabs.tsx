/**
 * 通知タブWidget
 *
 * FSDの原則：Widget層 - ページ固有のタブUI
 * 通知とお知らせを切り替えるタブ
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/config';

export type NotificationTabMode = 'notifications' | 'announcements';

interface NotificationTabsProps {
  tabMode: NotificationTabMode;
  onTabModeChange: (mode: NotificationTabMode) => void;
}

const TAB_OPTIONS: { mode: NotificationTabMode; label: string }[] = [
  { mode: 'notifications', label: '通知' },
  { mode: 'announcements', label: 'お知らせ' },
];

export function NotificationTabs({
  tabMode,
  onTabModeChange,
}: NotificationTabsProps) {
  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row">
        {TAB_OPTIONS.map((tab) => (
          <Pressable
            key={tab.mode}
            onPress={() => onTabModeChange(tab.mode)}
            className="flex-1 py-4 items-center"
          >
            <Text
              className={`text-sm font-semibold ${
                tabMode === tab.mode ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
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
