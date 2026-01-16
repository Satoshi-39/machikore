/**
 * マップサムネイル画像コンポーネント
 *
 * サムネイルURLがある場合はその画像を表示
 * ない場合はデフォルトのサムネイル画像を表示
 */

import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { ASSETS, colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface MapThumbnailProps {
  /** サムネイルURL（nullの場合はデフォルト画像） */
  url: string | null | undefined;
  /** 幅 */
  width: number;
  /** 高さ */
  height: number;
  /** 角丸（デフォルト: 8） */
  borderRadius?: number;
  /** デフォルト画像のパディング率（0〜0.5、デフォルト: 0.1） */
  defaultImagePadding?: number;
  /** 追加のクラス名 */
  className?: string;
  /** 背景色（指定時はデフォルトの背景色を上書き） */
  backgroundColor?: string;
}

export function MapThumbnail({
  url,
  width,
  height,
  borderRadius = 8,
  defaultImagePadding: paddingRate = 0.2,
  className = '',
  backgroundColor,
}: MapThumbnailProps) {
  const isDarkMode = useIsDarkMode();

  const source = url
    ? { uri: url }
    : ASSETS.images.defaultMapThumbnail;

  const contentFit = url ? 'cover' : 'contain';

  // デフォルト画像の場合はパディングを追加して小さく表示
  const padding = url ? 0 : Math.min(width, height) * paddingRate;

  // 背景色の決定: 指定があればそれを使用、なければダークモード対応のデフォルト
  const bgColor = backgroundColor ?? (isDarkMode ? colors.dark.muted : colors.light.muted);

  return (
    <View
      className={`overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: bgColor,
        // ダークモード時かつ背景色未指定の場合はボーダーを追加して境界を明確にする
        borderWidth: isDarkMode && !backgroundColor ? 1 : 0,
        borderColor: isDarkMode && !backgroundColor ? colors.dark.border : 'transparent',
      }}
    >
      <Image
        source={source}
        style={{
          width,
          height,
          padding,
        }}
        contentFit={contentFit}
        transition={200}
        cachePolicy="memory-disk"
      />
    </View>
  );
}
