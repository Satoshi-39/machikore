/**
 * クイック検索ボタン
 *
 * Google Mapsのようにカテゴリをタップして素早く検索
 */

import React from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

export type QuickSearchCategory = 'restaurant' | 'cafe' | 'tourism' | 'shopping' | 'station';

const CATEGORY_OPTIONS: {
  id: QuickSearchCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  searchQuery: string;
}[] = [
  { id: 'restaurant', label: 'レストラン', icon: 'restaurant', searchQuery: 'レストラン' },
  { id: 'cafe', label: 'カフェ', icon: 'cafe', searchQuery: 'カフェ' },
  { id: 'tourism', label: '観光', icon: 'camera', searchQuery: '観光' },
  { id: 'shopping', label: 'ショッピング', icon: 'bag', searchQuery: 'ショッピング' },
  { id: 'station', label: '駅', icon: 'train', searchQuery: '駅' },
];

interface QuickSearchButtonsProps {
  onCategoryPress: (query: string) => void;
}

export function QuickSearchButtons({ onCategoryPress }: QuickSearchButtonsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {CATEGORY_OPTIONS.map((option) => (
        <Pressable
          key={option.id}
          onPress={() => onCategoryPress(option.searchQuery)}
          className="flex-row items-center px-3 py-2 rounded-full bg-white active:bg-gray-100"
          style={{
            borderWidth: 1,
            borderColor: colors.gray[300],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Ionicons name={option.icon} size={16} color={colors.gray[600]} />
          <Text className="ml-1.5 text-sm text-gray-700">{option.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
