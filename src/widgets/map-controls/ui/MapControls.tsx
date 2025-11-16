/**
 * マップコントロールWidget
 *
 * 検索バーと表示モード切り替えボタンを組み合わせたコンポーネント
 * FSDの原則：Widget層は複数のFeatureを組み合わせた複合コンポーネント
 */

import React from 'react';
import { View } from 'react-native';
import { MapSearchBar, ViewModeToggle, type ViewMode } from '@/features/map';

interface MapControlsProps {
  variant: 'map' | 'list';
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchFocus: () => void;
  className?: string;
}

export function MapControls({
  variant,
  viewMode,
  onViewModeChange,
  onSearchFocus,
  className = 'px-5 pt-5',
}: MapControlsProps) {
  return (
    <View className={className}>
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <MapSearchBar variant={variant} onFocus={onSearchFocus} />
        </View>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </View>
    </View>
  );
}
