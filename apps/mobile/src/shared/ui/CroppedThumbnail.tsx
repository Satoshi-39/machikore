/**
 * クロップ座標に基づくサムネイル表示コンポーネント
 *
 * 元画像を保持したまま、クロップ座標でクライアント側表示を行う
 * overflow: hidden + 絶対配置で元画像の一部を切り出して表示
 */

import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import type { ThumbnailCrop } from '@/shared/lib/image';

interface CroppedThumbnailProps {
  /** 元画像のURL */
  url: string;
  /** クロップ座標 */
  crop: ThumbnailCrop;
  /** コンテナ幅 */
  width: number;
  /** アスペクト比（デフォルト: 1.91） */
  aspectRatio?: number;
  /** 角丸 */
  borderRadius?: number;
}

export function CroppedThumbnail({
  url,
  crop,
  width: containerWidth,
  aspectRatio = 1.91,
  borderRadius = 0,
}: CroppedThumbnailProps) {
  const containerHeight = containerWidth / aspectRatio;

  // クロップ領域をコンテナに合わせるスケール
  const scale = containerWidth / crop.width;
  const imageDisplayWidth = crop.imageWidth * scale;
  const imageDisplayHeight = crop.imageHeight * scale;

  return (
    <View
      style={{
        width: containerWidth,
        height: containerHeight,
        overflow: 'hidden',
        borderRadius,
      }}
    >
      <Image
        source={{ uri: url }}
        style={{
          position: 'absolute',
          width: imageDisplayWidth,
          height: imageDisplayHeight,
          left: -crop.originX * scale,
          top: -crop.originY * scale,
        }}
        cachePolicy="memory-disk"
      />
    </View>
  );
}
