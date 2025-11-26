/**
 * マップ検索バー
 *
 * FSDの原則：Features層のシンプルな検索バー機能
 */

import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface MapSearchBarProps {
  onFocus?: () => void;
  variant?: 'map' | 'list';
  showIcon?: boolean;
  placeholder?: string;
}

export function MapSearchBar({
  onFocus,
  variant = 'map',
  showIcon = true,
  placeholder = 'スポットを検索',
}: MapSearchBarProps) {
  return (
    <Pressable onPress={onFocus}>
      <View
        className={`flex-row items-center rounded-lg px-3 py-3 ${
          variant === 'map' ? 'bg-white shadow-md' : 'bg-gray-100'
        }`}
      >
        {showIcon ? (
          <Image
            source={require('../../../../assets/images/machikore7.png')}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name="search" size={20} color={colors.gray[400]} />
        )}
        <Text className="flex-1 ml-2 text-base text-gray-400">
          {placeholder}
        </Text>
      </View>
    </Pressable>
  );
}
