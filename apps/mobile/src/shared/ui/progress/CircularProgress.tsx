/**
 * 円形プログレスコンポーネント
 *
 * react-native-svgを使用した円形の進捗表示
 * 中央にテキスト（枚数など）を表示可能
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  /** 現在の値 */
  current: number;
  /** 最大値 */
  total: number;
  /** 円のサイズ（直径） */
  size?: number;
  /** 線の太さ */
  strokeWidth?: number;
}

export function CircularProgress({
  current,
  total,
  size = 80,
  strokeWidth = 6,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? Math.min(1, current / total) : 0;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* 背景の円 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* プログレスの円 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1A8CFF"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {/* 中央のテキスト */}
      <View className="absolute items-center justify-center">
        <Text className="text-lg font-bold text-on-surface">
          {current}/{total}
        </Text>
      </View>
    </View>
  );
}
