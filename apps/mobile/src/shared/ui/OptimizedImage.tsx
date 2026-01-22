/**
 * 最適化画像コンポーネント
 *
 * CDN経由でリサイズされた画像を読み込む汎用コンポーネント
 * サムネイル用途（フォールバックアイコン付き）ではなく、
 * 記事ページ等のコンテンツ画像に使用
 */

import React from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import { Image, type ImageContentFit } from 'expo-image';
import { getOptimizedImageUrl, getOptimalWidth } from '@/shared/lib/image';

interface OptimizedImageProps {
  /** 画像URL */
  url: string | null | undefined;
  /** 表示幅 */
  width: number;
  /** 表示高さ */
  height: number;
  /** 角丸（デフォルト: 0） */
  borderRadius?: number;
  /** 画質（デフォルト: 80） */
  quality?: number;
  /** コンテンツフィット（デフォルト: 'cover'） */
  contentFit?: ImageContentFit;
  /** 追加のクラス名 */
  className?: string;
  /** 追加のスタイル */
  style?: StyleProp<ViewStyle>;
  /** トランジション時間（デフォルト: 200ms） */
  transition?: number;
}

export function OptimizedImage({
  url,
  width,
  height,
  borderRadius = 0,
  quality = 80,
  contentFit = 'cover',
  className = '',
  style,
  transition = 200,
}: OptimizedImageProps) {
  // 表示サイズに応じた最適化URLを生成
  const optimizedUrl = getOptimizedImageUrl(url, {
    width: getOptimalWidth(width),
    height: getOptimalWidth(height),
    quality,
  });

  if (!optimizedUrl) {
    return null;
  }

  return (
    <View
      className={className}
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Image
        source={{ uri: optimizedUrl }}
        style={{
          width,
          height,
        }}
        contentFit={contentFit}
        transition={transition}
        cachePolicy="memory-disk"
      />
    </View>
  );
}
