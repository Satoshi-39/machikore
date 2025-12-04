/**
 * 現在地に戻るボタンコンポーネント
 *
 * マップ上で現在地にカメラを移動させるボタン
 * Google Mapsのような右下配置を想定
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationButtonProps {
  onPress: () => void;
  testID?: string;
}

export function LocationButton({ onPress, testID }: LocationButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className="w-14 h-14 rounded-full bg-surface dark:bg-dark-muted shadow-lg active:opacity-80"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View className="w-full h-full items-center justify-center">
        <Ionicons name="navigate" size={24} color="#007AFF" />
      </View>
    </Pressable>
  );
}
