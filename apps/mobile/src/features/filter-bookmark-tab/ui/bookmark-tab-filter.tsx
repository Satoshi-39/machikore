/**
 * ブックマークタブフィルター
 *
 * スポット/マップを切り替えるタブUI
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useI18n } from '@/shared/lib/i18n';

export type BookmarkTabMode = 'spots' | 'maps';

interface BookmarkTabFilterProps {
  tabMode: BookmarkTabMode;
  onTabModeChange: (mode: BookmarkTabMode) => void;
}

export function BookmarkTabFilter({
  tabMode,
  onTabModeChange,
}: BookmarkTabFilterProps) {
  const { t } = useI18n();

  return (
    <View className="bg-surface border-b border-outline flex-row">
      <Pressable
        onPress={() => onTabModeChange('maps')}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-base font-medium ${
            tabMode === 'maps' ? 'text-blue-500' : 'text-on-surface'
          }`}
        >
          {t('bookmark.maps')}
        </Text>
        {tabMode === 'maps' && (
          <View className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
        )}
      </Pressable>
      <Pressable
        onPress={() => onTabModeChange('spots')}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-base font-medium ${
            tabMode === 'spots' ? 'text-blue-500' : 'text-on-surface'
          }`}
        >
          {t('bookmark.spots')}
        </Text>
        {tabMode === 'spots' && (
          <View className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
        )}
      </Pressable>
    </View>
  );
}
