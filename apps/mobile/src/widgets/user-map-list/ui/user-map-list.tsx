/**
 * ユーザーマップリストWidget - リスト表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MapSearchBar } from '@/features/search-places';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
  return (
    <View className="flex-1">
      <MapSearchBar
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onFocus={onSearchFocus}
        showIcon={false}
        placeholder={t('userMapList.searchAndRegister')}
        className="px-5 pt-5 pb-3"
      />
      <View className="flex-1 items-center justify-center">
        <Text className="text-on-surface-variant">{t('userMapList.listView')}</Text>
      </View>
    </View>
  );
}
