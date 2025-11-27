/**
 * ビューモード切り替えボタン（共通）
 *
 * FSDの原則：共通のユーザーアクション機能
 */

import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

type IconName = keyof typeof Ionicons.glyphMap;

interface ViewModeConfig<T extends string> {
  modes: readonly [T, T]; // 2つのモードを定義
  icons: Record<T, IconName>; // 各モードに対応するアイコン
  nextMode: (current: T) => T; // 次のモードを返す関数
}

interface ViewModeToggleProps<T extends string> {
  viewMode: T;
  onViewModeChange: (mode: T) => void;
  config: ViewModeConfig<T>;
}

export function ViewModeToggle<T extends string>({
  viewMode,
  onViewModeChange,
  config,
}: ViewModeToggleProps<T>) {
  const handleToggle = () => {
    const nextMode = config.nextMode(viewMode);
    onViewModeChange(nextMode);
  };

  const icon = config.icons[viewMode];

  return (
    <Pressable
      onPress={handleToggle}
      className={`rounded-lg ${
        viewMode === config.modes[0] ? 'p-3 bg-white shadow-md' : 'p-2 bg-gray-100'
      }`}
    >
      <Ionicons name={icon} size={24} color={colors.gray[600]} />
    </Pressable>
  );
}

// プリセット設定をエクスポート

export type MapHierarchyViewMode = 'map' | 'hierarchy';

export const mapHierarchyConfig: ViewModeConfig<MapHierarchyViewMode> = {
  modes: ['map', 'hierarchy'],
  icons: {
    map: 'list-outline',
    hierarchy: 'map-outline',
  },
  nextMode: (current) => (current === 'map' ? 'hierarchy' : 'map'),
};

export type MapListViewMode = 'map' | 'list';

export const mapListConfig: ViewModeConfig<MapListViewMode> = {
  modes: ['map', 'list'],
  icons: {
    map: 'list-outline',
    list: 'map-outline',
  },
  nextMode: (current) => (current === 'map' ? 'list' : 'map'),
};
