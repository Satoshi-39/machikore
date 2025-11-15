/**
 * ビューモード切り替えボタン（マップ用）
 *
 * FSDの原則：Features層はユーザーアクションを実現する機能
 */

import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

export type ViewMode = 'map' | 'list';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  const handleToggle = () => {
    onViewModeChange(viewMode === 'map' ? 'list' : 'map');
  };

  return (
    <Pressable
      onPress={handleToggle}
      className={`rounded-lg ${
        viewMode === 'map' ? 'p-3 bg-white shadow-md' : 'p-2 bg-gray-100'
      }`}
    >
      <Ionicons
        name={viewMode === 'list' ? 'map-outline' : 'list-outline'}
        size={24}
        color={colors.gray[600]}
      />
    </Pressable>
  );
}
