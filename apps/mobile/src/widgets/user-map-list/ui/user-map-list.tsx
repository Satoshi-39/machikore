/**
 * ユーザーマップリストWidget - リスト表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MapSearchBar } from '@/features/search-places';
import type { MapListViewMode } from '@/features/toggle-view-mode';

interface UserMapListProps {
  viewMode: MapListViewMode;
  onViewModeChange: (mode: MapListViewMode) => void;
  onSearchFocus: () => void;
}

export function UserMapList({
  viewMode,
  onViewModeChange,
  onSearchFocus,
}: UserMapListProps) {
  return (
    <View className="flex-1">
      <MapSearchBar
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onFocus={onSearchFocus}
        showIcon={false}
        placeholder="検索して登録"
        className="px-5 pt-5 pb-3"
      />
      <View className="flex-1 items-center justify-center">
        <Text className="text-on-surface-variant">リスト表示（実装予定）</Text>
      </View>
    </View>
  );
}
