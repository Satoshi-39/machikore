/**
 * カスタムユーザーロケーションアイコン
 *
 * ダークモードでも見やすいように白い縁取り付きの青いドット
 */

import React from 'react';
import { View } from 'react-native';

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
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // 薄い青（外側のリング）
        alignItems: 'center',
        justifyContent: 'center',
        // ダークモードでも見やすいように白い影を追加
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: '#3B82F6', // 青（中央のドット）
          borderWidth: borderWidth,
          borderColor: '#FFFFFF', // 白い縁取り
        }}
      />
    </View>
  );
}
