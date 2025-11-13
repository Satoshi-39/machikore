/**
 * パンくずリストコンポーネント
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  // 空の場合は固定高さの空白を表示
  if (items.length === 0) {
    return <View className="h-[42px] bg-white border-b border-gray-200" />;
  }

  return (
    <View className="flex-row items-center px-5 py-3 bg-white border-b border-gray-200">
      {items.map((item, index) => (
        <View key={index} className="flex-row items-center">
          {index > 0 && (
            <Ionicons
              name="chevron-forward"
              size={16}
              color="#9CA3AF"
              style={{ marginHorizontal: 8 }}
            />
          )}
          {item.onPress ? (
            <TouchableOpacity onPress={item.onPress}>
              <Text className="text-sm text-blue-600">{item.label}</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-sm text-gray-800 font-medium">{item.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
