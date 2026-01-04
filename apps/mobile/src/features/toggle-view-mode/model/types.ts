/**
 * ビューモード切り替え Feature 型定義
 */

import type { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

/**
 * ビューモード設定
 */
export interface ViewModeConfig<T extends string> {
  modes: readonly [T, T];
  icons: Record<T, IconName>;
  nextMode: (current: T) => T;
}

/**
 * ビューモードトグルのProps
 */
export interface ViewModeToggleProps<T extends string> {
  viewMode: T;
  onViewModeChange: (mode: T) => void;
  config: ViewModeConfig<T>;
}

/**
 * マップ/階層ビューモード
 */
export type MapHierarchyViewMode = 'map' | 'hierarchy';

/**
 * マップ/リストビューモード
 */
export type MapListViewMode = 'map' | 'list';
