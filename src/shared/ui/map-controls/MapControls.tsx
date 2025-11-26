/**
 * マップコントロール
 *
 * 検索バーと表示モード切り替えボタンを組み合わせた共通UIコンポーネント
 * FSDの原則：Shared層の汎用UIコンポーネント
 */

import React from 'react';
import { View } from 'react-native';
import { MapSearchBar } from '@/features/search-places';
import {
  ViewModeToggle,
  mapListConfig,
  type MapListViewMode,
} from '@/features/toggle-view-mode';

interface MapControlsProps {
  variant: 'map' | 'list';
  viewMode: MapListViewMode;
  onViewModeChange: (mode: MapListViewMode) => void;
  onSearchFocus: () => void;
  showIcon?: boolean;
  placeholder?: string;
  className?: string;
}

export function MapControls({
  variant,
  viewMode,
  onViewModeChange,
  onSearchFocus,
  showIcon = true,
  placeholder = 'スポットを検索',
  className = 'px-5 pt-5',
}: MapControlsProps) {
  return (
    <View className={className}>
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <MapSearchBar
            variant={variant}
            onFocus={onSearchFocus}
            showIcon={showIcon}
            placeholder={placeholder}
          />
        </View>
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          config={mapListConfig}
        />
      </View>
    </View>
  );
}
