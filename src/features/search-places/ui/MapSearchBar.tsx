/**
 * マップ検索バー（非フォーカス時のダミー検索バー）
 *
 * FSDの原則：Features層のシンプルな検索バー機能
 * タップで検索画面を開く + ビューモード切り替え
 */

import React from 'react';
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { mapListConfig, type MapListViewMode } from '@/features/toggle-view-mode';

interface MapSearchBarProps {
  onFocus?: () => void;
  variant?: 'map' | 'list';
  showIcon?: boolean;
  placeholder?: string;
  viewMode?: MapListViewMode;
  onViewModeChange?: (mode: MapListViewMode) => void;
  className?: string;
}

export function MapSearchBar({
  onFocus,
  variant = 'map',
  showIcon = true,
  placeholder = 'スポットを検索',
  viewMode,
  onViewModeChange,
  className = 'px-5 pt-5',
}: MapSearchBarProps) {
  const isDarkMode = useIsDarkMode();
  const viewModeIcon = viewMode ? mapListConfig.icons[viewMode] : undefined;

  const handleViewModeToggle = () => {
    if (viewMode && onViewModeChange) {
      const nextMode = mapListConfig.nextMode(viewMode);
      onViewModeChange(nextMode);
    }
  };

  return (
    <View className={className}>
      <Pressable onPress={onFocus}>
        <View
          className={`flex-row items-center rounded-full px-4 py-3 ${
            variant === 'map' ? 'bg-muted dark:bg-dark-muted shadow-md' : 'bg-muted dark:bg-dark-muted'
          }`}
        >
          {showIcon ? (
            <Image
              source={require('../../../../assets/images/machikore7.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="search" size={20} color={colors.gray[400]} />
          )}
          <Text className="flex-1 ml-2 text-base text-foreground-muted dark:text-dark-foreground">
            {placeholder}
          </Text>
          {viewModeIcon && onViewModeChange && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleViewModeToggle();
              }}
              className="ml-2 p-1"
            >
              <Ionicons name={viewModeIcon} size={22} color={isDarkMode ? colors.gray[300] : colors.gray[600]} />
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </View>
  );
}
