/**
 * マップサムネイル画像コンポーネント
 *
 * サムネイルURLがある場合はその画像を表示
 * ない場合はデフォルトのサムネイル画像を表示
 */

import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { ASSETS } from '@/shared/config';

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
}

export function MapThumbnail({
  url,
  width,
  height,
  borderRadius = 8,
  defaultImagePadding: paddingRate = 0.2,
  className = '',
}: MapThumbnailProps) {
  const [isLoading, setIsLoading] = useState(!!url);

  const source = url
    ? { uri: url }
    : ASSETS.images.defaultMapThumbnail;

  const resizeMode = url ? 'cover' : 'contain';

  // デフォルト画像の場合はパディングを追加して小さく表示
  const padding = url ? 0 : Math.min(width, height) * paddingRate;

  return (
    <View
      className={`overflow-hidden bg-muted dark:bg-dark-muted ${className}`}
      style={{ width, height, borderRadius }}
    >
      {/* URLがある場合のみローディングプレースホルダー表示 */}
      {isLoading && url && (
        <View
          className="absolute inset-0 bg-muted dark:bg-dark-muted"
          style={{ width, height }}
        />
      )}
      <Image
        source={source}
        style={{
          width,
          height,
          padding,
        }}
        resizeMode={resizeMode}
        onLoad={() => setIsLoading(false)}
      />
    </View>
  );
}
