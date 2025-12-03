/**
 * 発見タブWidget
 *
 * FSDの原則：Widget層 - ページ固有のタブUI
 * スポットとマップを切り替えるタブ（通知ページと同じスタイル）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '@/shared/config';

export type DiscoverTabMode = 'spots' | 'maps';

interface DiscoverTabsProps {
  tabMode: DiscoverTabMode;
  onTabModeChange: (mode: DiscoverTabMode) => void;
}

const TAB_OPTIONS: { mode: DiscoverTabMode; label: string }[] = [
  { mode: 'spots', label: 'スポット' },
  { mode: 'maps', label: 'マップ' },
];

export function DiscoverTabs({ tabMode, onTabModeChange }: DiscoverTabsProps) {
  return (
    <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border">
      <View className="flex-row">
        {TAB_OPTIONS.map((option) => {
          const isActive = tabMode === option.mode;
          return (
            <Pressable
              key={option.mode}
              onPress={() => onTabModeChange(option.mode)}
              className="flex-1 py-4 items-center"
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? 'text-foreground dark:text-dark-foreground' : 'text-foreground-secondary dark:text-dark-foreground-secondary'
                }`}
              >
                {option.label}
              </Text>
              {isActive && (
                <View
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                  style={{ backgroundColor: colors.primary.DEFAULT }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
