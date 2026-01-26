/**
 * パンくずリストコンポーネント
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  // 空の場合は固定高さの空白を表示
  if (items.length === 0) {
    return <View className="h-[42px] bg-surface border-b border-outline" />;
  }

  return (
    <View className="flex-row items-center px-5 py-3 bg-surface border-b border-outline">
      {items.map((item, index) => (
        <View key={index} className="flex-row items-center">
          {index > 0 && (
            <Ionicons
              name="chevron-forward"
              size={iconSizeNum.sm}
              color={themeColors['on-surface-variant']}
              style={{ marginHorizontal: 8 }}
            />
          )}
          {item.onPress ? (
            <TouchableOpacity onPress={item.onPress}>
              <Text className="text-sm text-blue-600">{item.label}</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-sm text-on-surface font-medium">{item.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
