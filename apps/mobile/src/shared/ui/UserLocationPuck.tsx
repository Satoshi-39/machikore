/**
 * カスタムユーザーロケーションアイコン
 *
 * ダークモードでも見やすいように白い縁取り付きの青いドット
 */

import React from 'react';
import { View } from 'react-native';
import { colors, shadow } from '@/shared/config';

interface UserLocationPuckProps {
  size?: number;
}

export function UserLocationPuck({ size = 24 }: UserLocationPuckProps) {
  const outerSize = size;
  const innerSize = size * 0.6;
  const borderWidth = size * 0.15;

  return (
    <View
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: outerSize / 2,
        backgroundColor: colors.light['primary-container'],
        alignItems: 'center',
        justifyContent: 'center',
        // ダークモードでも見やすいように白い影を追加
        ...shadow.dropdown,
        shadowColor: colors.light.surface,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
      }}
    >
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colors.light.primary,
          borderWidth: borderWidth,
          borderColor: colors.light.surface,
        }}
      />
    </View>
  );
}
