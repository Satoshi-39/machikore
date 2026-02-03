/**
 * 選択位置に戻るボタンコンポーネント
 *
 * カード表示中に選択したアイテムの位置にカメラを移動させるボタン
 * 現在地ボタンの下に配置
 */

import { colors, iconSizeNum, shadow } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

interface SelectedLocationButtonProps {
  onPress: () => void;
  testID?: string;
}

export function SelectedLocationButton({
  onPress,
  testID,
}: SelectedLocationButtonProps) {
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
          name="scan"
          size={iconSizeNum.lg}
          color={isDarkMode ? colors.dark['on-surface'] : colors.light.primary}
        />
      </View>
    </Pressable>
  );
}
