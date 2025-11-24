/**
 * マップ検索バー
 *
 * FSDの原則：Features層のシンプルな検索バー機能
 */

import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';

interface MapSearchBarProps {
  onFocus?: () => void;
  variant?: 'map' | 'list';
}

export function MapSearchBar({ onFocus, variant = 'map' }: MapSearchBarProps) {
  return (
    <Pressable onPress={onFocus}>
      <View
        className={`flex-row items-center rounded-lg px-3 py-3 ${
          variant === 'map' ? 'bg-white shadow-md' : 'bg-gray-100'
        }`}
      >
        <Image
          source={require('../../../../assets/images/machikore7.png')}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="flex-1 ml-2 text-base text-gray-400">
          スポットを検索
        </Text>
      </View>
    </Pressable>
  );
}
