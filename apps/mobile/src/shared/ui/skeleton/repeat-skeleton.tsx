/**
 * RepeatSkeleton - スケルトンカードをN個繰り返し描画するユーティリティ
 */

import React from 'react';
import { View } from 'react-native';

interface RepeatSkeletonProps {
  /** 繰り返し描画するスケルトンコンポーネント */
  component: React.ComponentType;
  /** 繰り返し回数（デフォルト: 3） */
  count?: number;
}

export function RepeatSkeleton({ component: Component, count = 3 }: RepeatSkeletonProps) {
  return (
    <View>
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </View>
  );
}
