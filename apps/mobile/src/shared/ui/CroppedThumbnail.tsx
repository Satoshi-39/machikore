/**
 * クロップ座標に基づくサムネイル表示コンポーネント
 *
 * 元画像を保持したまま、クロップ座標でクライアント側表示を行う
 * overflow: hidden + 絶対配置で元画像の一部を切り出して表示
 *
 * 画像最適化:
 * - width+heightを指定してサーバーに元画像をアスペクト比維持で縮小させる
 *   (widthのみだとSupabaseは高さをリサイズしないため両方必須)
 * - アスペクト比が一致するのでサーバー側cropは発生しない（純粋な縮小のみ）
 * - cropはクライアント側で従来通り実行
 * - Retina対応で表示サイズの2倍を要求（getOptimalWidth）
 */

import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { getOptimizedImageUrl, getOptimalWidth, type ThumbnailCrop } from '@/shared/lib/image';

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

  // 画像最適化: 表示に必要なサイズをRetina対応で要求（元画像より大きくならないよう制限）
  // width+height両方指定が必須（widthのみだとSupabaseは高さをリサイズしない）
  // アスペクト比が元画像と同じなのでresize=coverでも純粋な縮小のみ（サーバー側cropなし）
  const optimalWidth = Math.min(getOptimalWidth(imageDisplayWidth), crop.imageWidth);
  const optimalHeight = Math.round(optimalWidth * crop.imageHeight / crop.imageWidth);
  const optimizedUrl = getOptimizedImageUrl(url, { width: optimalWidth, height: optimalHeight, quality: 80 });

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
        source={{ uri: optimizedUrl ?? url }}
        style={{
          position: 'absolute',
          width: imageDisplayWidth,
          height: imageDisplayHeight,
          left: -crop.originX * scale,
          top: -crop.originY * scale,
        }}
        cachePolicy="disk"
      />
    </View>
  );
}
