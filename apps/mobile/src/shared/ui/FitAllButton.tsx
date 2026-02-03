/**
 * 全スポット表示ボタンコンポーネント
 *
 * マップ上の全スポットが見えるようにカメラを調整するボタン
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum, shadow } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface FitAllButtonProps {
  onPress: () => void;
  testID?: string;
}

export function FitAllButton({ onPress, testID }: FitAllButtonProps) {
  const isDarkMode = useIsDarkMode();

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className="w-14 h-14 rounded-full bg-surface shadow-lg active:opacity-80"
      style={shadow.dropdown}
    >
      <View className="w-full h-full items-center justify-center">
        <Ionicons
          name="scan-outline"
          size={iconSizeNum.lg}
          color={isDarkMode ? colors.dark['on-surface'] : colors.light.primary}
        />
      </View>
    </Pressable>
  );
}
