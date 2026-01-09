/**
 * 全スポット表示ボタンコンポーネント
 *
 * マップ上の全スポットが見えるようにカメラを調整するボタン
 */

import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface FitAllButtonProps {
  onPress: () => void;
  testID?: string;
}

export function FitAllButton({ onPress, testID }: FitAllButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className="w-11 h-11 rounded-full items-center justify-center active:opacity-80"
      style={{
        backgroundColor: colors.secondary.DEFAULT,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Ionicons
        name="scan-outline"
        size={24}
        color="#FFFFFF"
      />
    </Pressable>
  );
}
