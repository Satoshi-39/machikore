/**
 * クイック検索/フィルタリングボタン
 *
 * 訪問済み/未訪問はマップ上のフィルタリング
 * その他はカテゴリ検索
 */

import React from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

export type QuickSearchCategory = 'visited' | 'not_visited' | 'favorite' | 'tourism' | 'shopping' | 'station';
export type VisitFilter = 'all' | 'visited' | 'not_visited' | 'favorite';

const FILTER_OPTIONS: {
  id: QuickSearchCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isFilter: boolean; // true: マップフィルタリング, false: 検索
  searchQuery?: string;
  filterValue?: VisitFilter;
}[] = [
  { id: 'visited', label: '訪問済み', icon: 'checkmark-circle', isFilter: true, filterValue: 'visited' },
  { id: 'not_visited', label: '未訪問', icon: 'ellipse-outline', isFilter: true, filterValue: 'not_visited' },
  { id: 'favorite', label: 'お気に入り', icon: 'star', isFilter: true, filterValue: 'favorite' },
  { id: 'tourism', label: '観光', icon: 'camera', isFilter: false, searchQuery: '観光' },
  { id: 'shopping', label: 'ショッピング', icon: 'bag', isFilter: false, searchQuery: 'ショッピング' },
  { id: 'station', label: '駅', icon: 'train', isFilter: false, searchQuery: '駅' },
];

interface QuickSearchButtonsProps {
  activeFilter?: VisitFilter;
  onFilterChange?: (filter: VisitFilter) => void;
  onCategoryPress?: (query: string) => void;
}

export function QuickSearchButtons({ activeFilter = 'all', onFilterChange, onCategoryPress }: QuickSearchButtonsProps) {
  const isDarkMode = useIsDarkMode();

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
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
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
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.4 : 0.15,
              shadowRadius: isDarkMode ? 6 : 4,
              elevation: isDarkMode ? 6 : 3,
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
