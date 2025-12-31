/**
 * 選択位置に戻るボタンコンポーネント
 *
 * カード表示中に選択したアイテムの位置にカメラを移動させるボタン
 * 現在地ボタンの下に配置
 */

import { colors } from '@/shared/config';
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
        <Ionicons
          name="scan"
          size={24}
          color={isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT}
        />
      </View>
    </Pressable>
  );
}
