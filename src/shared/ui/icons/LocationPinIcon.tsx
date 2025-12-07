/**
 * スポット用ロケーションピンアイコン（塗りつぶし、中に丸なし）
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LocationPinIconProps {
  size?: number;
  color?: string;
}

export function LocationPinIcon({ size = 24, color = '#3B82F6' }: LocationPinIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      {/* ピンの外形 + 中央の穴（evenoddで穴を開ける） */}
      <Path
        d="M256 32C167.67 32 96 96.51 96 176c0 128 160 304 160 304s160-176 160-304c0-79.49-71.67-144-160-144z M256 112a64 64 0 1 0 0 128 64 64 0 0 0 0-128z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}
