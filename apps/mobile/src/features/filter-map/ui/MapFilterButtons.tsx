/**
 * マップフィルターボタン
 *
 * FSDの原則：Features層のフィルター機能
 */

import React from 'react';
import { View, Pressable, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { MapFilter, MapFilterButtonsProps } from '../model/types';

const FILTER_OPTIONS = [
  { id: 'nearby' as const, label: '現在地周辺', icon: 'location' as const },
  { id: 'visited' as const, label: '訪問済み', icon: 'checkmark-circle' as const },
  { id: 'favorite' as const, label: 'お気に入り', icon: 'star' as const },
  { id: 'recommended' as const, label: '他ユーザのおすすめ', icon: 'people' as const },
];

export function MapFilterButtons({
  selectedFilters = [],
  onFilterToggle,
}: MapFilterButtonsProps) {
  const handleFilterPress = (filter: MapFilter) => {
    onFilterToggle?.(filter);
  };

  const isFilterSelected = (filter: MapFilter) => {
    return selectedFilters.includes(filter);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {FILTER_OPTIONS.map((option) => {
        const selected = isFilterSelected(option.id);
        return (
          <View
            key={option.id}
            style={{ marginRight: 8 }}
          >
            <Pressable
              onPress={() => handleFilterPress(option.id)}
              className="flex-row items-center px-4 py-2 rounded-full bg-surface dark:bg-dark-surface"
              style={{
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? colors.primary.DEFAULT : colors.gray[300],
              }}
            >
              <Ionicons
                name={option.icon}
                size={16}
                color={selected ? colors.primary.DEFAULT : colors.gray[600]}
              />
              <Text
                className={`ml-1.5 text-sm ${
                  selected ? 'text-blue-700 font-semibold' : 'text-foreground-secondary dark:text-dark-foreground-secondary'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}
