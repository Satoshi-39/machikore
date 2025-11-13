/**
 * FAB (Floating Action Button) コンポーネント
 *
 * X(Twitter)のような右下固定の浮動アクションボタン
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  testID?: string;
}

export function FAB({
  onPress,
  icon = 'add',
  color = colors.primary.light,
  testID
}: FABProps) {
  return (
    <View className="absolute bottom-6 right-6 z-50">
      <Pressable
        onPress={onPress}
        testID={testID}
        className="w-14 h-14 rounded-full shadow-lg active:opacity-80"
        style={{ backgroundColor: color }}
      >
        <View className="w-full h-full items-center justify-center">
          <Ionicons name={icon} size={24} color="white" />
        </View>
      </Pressable>
    </View>
  );
}
