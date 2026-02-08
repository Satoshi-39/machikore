/**
 * マップフィルターボタン
 *
 * FSDの原則：Features層のフィルター機能
 */

import React, { useMemo } from 'react';
import { View, Pressable, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import type { MapFilter, MapFilterButtonsProps } from '../model/types';

export function MapFilterButtons({
  selectedFilters = [],
  onFilterToggle,
}: MapFilterButtonsProps) {
  const { t } = useI18n();

  const FILTER_OPTIONS = useMemo(() => [
    { id: 'nearby' as const, label: t('filterButton.nearby'), icon: 'location' as const },
    { id: 'visited' as const, label: t('filterButton.visited'), icon: 'checkmark-circle' as const },
    { id: 'favorite' as const, label: t('filterButton.favorite'), icon: 'star' as const },
    { id: 'recommended' as const, label: t('filterButton.recommended'), icon: 'people' as const },
  ], [t]);

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
              className="flex-row items-center px-4 py-2 rounded-full bg-surface"
              style={{
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? colors.light.primary : colors.primitive.gray[300],
              }}
            >
              <Ionicons
                name={option.icon}
                size={iconSizeNum.sm}
                color={selected ? colors.light.primary : colors.primitive.gray[600]}
              />
              <Text
                className={`ml-1.5 text-sm ${
                  selected ? 'text-blue-700 font-semibold' : 'text-on-surface-variant'
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
