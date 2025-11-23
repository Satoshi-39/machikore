/**
 * マップコントロールWidget
 *
 * 検索バーと表示モード切り替えボタンを組み合わせたコンポーネント
 * FSDの原則：Widget層は複数のFeatureを組み合わせた複合コンポーネント
 */

import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  className?: string;
  showLogo?: boolean;
}

export function MapControls({
  variant,
  viewMode,
  onViewModeChange,
  onSearchFocus,
  className = 'px-5 pt-5',
  showLogo = false,
}: MapControlsProps) {
  return (
    <View className={className}>
      <View className="flex-row items-start gap-3">
        {/* 街コレアイコン（デフォルトマップのみ） */}
        {showLogo && (
          <View className="items-center justify-center mt-3">
            <Ionicons name="map" size={24} color="#007AFF" />
          </View>
        )}

        <View className="flex-1">
          <MapSearchBar variant={variant} onFocus={onSearchFocus} />
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
