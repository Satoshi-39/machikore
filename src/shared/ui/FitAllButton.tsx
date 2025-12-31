/**
 * 全スポット表示ボタンコンポーネント
 *
 * マップ上の全スポットが見えるようにカメラを調整するボタン
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
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
          name="scan-outline"
          size={24}
          color={isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT}
        />
      </View>
    </Pressable>
  );
}
