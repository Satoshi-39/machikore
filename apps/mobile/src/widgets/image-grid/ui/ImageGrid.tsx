/**
 * X（Twitter）風の画像グリッド表示
 *
 * 画像枚数に応じてレイアウトを変更:
 * - 1枚: 横幅いっぱい（高さ60%）
 * - 2枚: 2列で表示
 * - 3枚: 上段2列、下段1列（横幅いっぱい）
 * - 4枚以上: 2x2グリッド、5枚目以降は「+N」オーバーレイ
 */

import React from 'react';
import { View, Pressable, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { getOptimizedImageUrl, getOptimalWidth } from '@/shared/lib/image';

interface ImageGridProps {
  /** 画像URL配列 */
  images: string[];
  /** コンテナの幅（省略時はscreenWidth - 32） */
  containerWidth?: number;
  /** 画像タップ時のコールバック（タップした画像のインデックス） */
  onImagePress?: (index: number) => void;
  /** 角丸（デフォルト: 8） */
  borderRadius?: number;
  /** グリッド間のギャップ（デフォルト: 4） */
  gap?: number;
}

export function ImageGrid({
  images,
  containerWidth: containerWidthProp,
  onImagePress,
  borderRadius = 8,
  gap = 4,
}: ImageGridProps) {
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = containerWidthProp ?? screenWidth - 32;

  if (images.length === 0) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap" style={{ gap }}>
      {images.slice(0, 4).map((imageUri, index) => {
        const isLastWithMore = index === 3 && images.length > 4;
        const halfSize = (containerWidth - gap) / 2;

        // 1枚の場合は横幅いっぱい、3枚の場合の3枚目も横幅いっぱい
        const isSingleImage = images.length === 1;
        const isThirdOfThree = images.length === 3 && index === 2;
        const isFullWidth = isSingleImage || isThirdOfThree;
        const imageWidth = isFullWidth ? containerWidth : halfSize;
        const imageHeight = isSingleImage ? containerWidth * 0.6 : halfSize;

        // 表示サイズに応じた最適化URLを生成（width, height両方指定でresize=cover適用）
        const optimizedUrl = getOptimizedImageUrl(imageUri, {
          width: getOptimalWidth(imageWidth),
          height: getOptimalWidth(imageHeight),
          quality: 75,
        });

        return (
          <Pressable
            key={`${imageUri}-${index}`}
            onPress={(e) => {
              e.stopPropagation();
              onImagePress?.(index);
            }}
          >
            <View style={{ width: imageWidth, height: imageHeight, position: 'relative' }}>
              <Image
                source={{ uri: optimizedUrl || imageUri }}
                style={{ width: imageWidth, height: imageHeight, borderRadius }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
              {isLastWithMore && (
                <View
                  className="absolute inset-0 bg-black/50 items-center justify-center"
                  style={{ borderRadius }}
                >
                  <Text className="text-white text-lg font-bold">
                    +{images.length - 4}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
