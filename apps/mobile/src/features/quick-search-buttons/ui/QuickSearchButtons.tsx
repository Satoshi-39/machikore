/**
 * クイック検索/フィルタリングボタン
 *
 * 訪問済み/未訪問はマップ上のフィルタリング
 * その他はカテゴリ検索
 */

import React, { useMemo } from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum, shadow, spacingNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';

export type QuickSearchCategory = 'visited' | 'not_visited' | 'favorite' | 'tourism' | 'shopping' | 'station';
export type VisitFilter = 'all' | 'visited' | 'not_visited' | 'favorite';

interface QuickSearchButtonsProps {
  activeFilter?: VisitFilter;
  onFilterChange?: (filter: VisitFilter) => void;
  onCategoryPress?: (query: string) => void;
}

export function QuickSearchButtons({ activeFilter = 'all', onFilterChange, onCategoryPress }: QuickSearchButtonsProps) {
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();

  const FILTER_OPTIONS = useMemo(() => [
    { id: 'visited' as const, label: t('quickSearch.visited'), icon: 'checkmark-circle' as const, isFilter: true, filterValue: 'visited' as VisitFilter },
    { id: 'not_visited' as const, label: t('quickSearch.notVisited'), icon: 'ellipse-outline' as const, isFilter: true, filterValue: 'not_visited' as VisitFilter },
    { id: 'favorite' as const, label: t('quickSearch.favorite'), icon: 'star' as const, isFilter: true, filterValue: 'favorite' as VisitFilter },
    { id: 'tourism' as const, label: t('quickSearch.tourism'), icon: 'camera' as const, isFilter: false, searchQuery: t('quickSearch.tourism') },
    { id: 'shopping' as const, label: t('quickSearch.shopping'), icon: 'bag' as const, isFilter: false, searchQuery: t('quickSearch.shopping') },
    { id: 'station' as const, label: t('quickSearch.station'), icon: 'train' as const, isFilter: false, searchQuery: t('quickSearch.station') },
  ], [t]);

  const handlePress = (option: typeof FILTER_OPTIONS[number]) => {
    if (option.isFilter && option.filterValue && onFilterChange) {
      // トグル動作: 同じフィルタを再度押すと解除（allに戻す）
      const newFilter = activeFilter === option.filterValue ? 'all' : option.filterValue;
      onFilterChange(newFilter);
    } else if (!option.isFilter && option.searchQuery && onCategoryPress) {
      onCategoryPress(option.searchQuery);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacingNum[5], gap: spacingNum[2] }}
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = option.isFilter && activeFilter === option.filterValue;
        return (
          <Pressable
            key={option.id}
            onPress={() => handlePress(option)}
            className={`flex-row items-center px-3 py-2 rounded-full active:opacity-80 ${
              isActive ? 'bg-primary' : 'bg-surface-variant'
            }`}
            style={{
              ...shadow.dropdown,
              ...(isDarkMode && { shadowOpacity: 0.4 }),
            }}
          >
            <Ionicons
              name={option.icon}
              size={iconSizeNum.sm}
              color={isActive ? 'white' : (isDarkMode ? colors.primitive.gray[300] : colors.primitive.gray[600])}
            />
            <Text className={`ml-1.5 text-sm font-medium ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
