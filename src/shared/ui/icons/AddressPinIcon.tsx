/**
 * 住所用ロケーションピンアイコン（中央に白い穴 + その中に小さい塗りつぶし円）
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface AddressPinIconProps {
  size?: number;
  color?: string;
}

export function AddressPinIcon({ size = 24, color = '#6B7280' }: AddressPinIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      {/* ピンの外形 */}
      <Path
        d="M256 32C167.67 32 96 96.51 96 176c0 128 160 304 160 304s160-176 160-304c0-79.49-71.67-144-160-144z"
        fill={color}
      />
      {/* 中央の白い穴 */}
      <Circle cx="256" cy="176" r="64" fill="white" />
      {/* 穴の中の小さい塗りつぶし円 */}
      <Circle cx="256" cy="176" r="24" fill={color} />
    </Svg>
  );
}
