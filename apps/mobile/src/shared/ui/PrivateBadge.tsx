/**
 * 非公開バッジコンポーネント
 *
 * スポットやマップが非公開であることを示すアイコン
 * オーナーにのみ表示される
 */

import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface PrivateBadgeProps {
  /** バッジのサイズ（プリセットまたは数値） */
  size?: 'sm' | 'md' | 'lg' | number;
  /** 追加のスタイルクラス */
  className?: string;
}

export function PrivateBadge({ size = 'md', className = '' }: PrivateBadgeProps) {
  const iconSize = typeof size === 'number'
    ? size
    : size === 'sm' ? 12 : size === 'lg' ? 20 : 14;

  return (
    <View
      className={`items-center justify-center ${className}`}
    >
      <Ionicons name="lock-closed" size={iconSize} color={colors.gray[500]} />
    </View>
  );
}
