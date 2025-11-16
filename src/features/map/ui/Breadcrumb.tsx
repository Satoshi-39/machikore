/**
 * パンくずリストコンポーネント
 *
 * 階層ナビゲーションの現在位置を表示
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
  return (
    <View className="bg-white border-b border-gray-200 px-5 py-3">
      <View className="flex-row items-center flex-wrap">
        {items.map((item, index) => (
          <View key={`${item.label}-${index}`} className="flex-row items-center">
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
                <Text className="text-sm font-medium text-blue-500">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-sm font-medium text-gray-800">
                {item.label}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
