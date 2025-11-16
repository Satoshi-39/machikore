/**
 * 通知フィルターヘッダー
 *
 * 通知とお知らせを切り替えるUI
 *
 * TODO: 将来的にデータ実装時、通知とお知らせは別ドメインなので
 * entities/notification と entities/announcement に分離し、
 * このコンポーネントは widgets/notification-tabs に移動する
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/config';

export type NotificationFilterMode = 'notifications' | 'announcements';

interface NotificationFilterHeaderProps {
  filterMode: NotificationFilterMode;
  onFilterModeChange: (mode: NotificationFilterMode) => void;
}

export function NotificationFilterHeader({
  filterMode,
  onFilterModeChange,
}: NotificationFilterHeaderProps) {
  const filterTabs: { mode: NotificationFilterMode; label: string }[] = [
    { mode: 'notifications', label: '通知' },
    { mode: 'announcements', label: 'お知らせ' },
  ];

  return (
    <View className="bg-white border-b border-gray-200">
      {/* フィルタータブ */}
      <View className="flex-row">
        {filterTabs.map((tab) => (
          <Pressable
            key={tab.mode}
            onPress={() => onFilterModeChange(tab.mode)}
            className="flex-1 py-4 items-center"
          >
            <Text
              className={`text-sm font-semibold ${
                filterMode === tab.mode ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
            {filterMode === tab.mode && (
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
