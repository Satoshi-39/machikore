/**
 * Google Maps風 写真グリッドコンポーネント
 *
 * FSD: shared/ui - 汎用的な写真表示UI
 *
 * レイアウトパターン（1〜3枚はコンテナ幅いっぱいに表示）:
 * - 1枚: 横幅いっぱい、4:3比率
 * - 2枚: 同サイズ横並びで横幅いっぱい
 * - 3枚: 大（60%）→ 小小（40%、縦積み）で横幅いっぱい
 * - 4枚以上: 大 → 小小（縦積み） → 大 → 小小... の繰り返し横スクロール
 */

import React, { useState, useCallback } from 'react';
import { View, Pressable, ScrollView, type LayoutChangeEvent } from 'react-native';
import { Image } from 'expo-image';
import { getOptimizedImageUrl, getOptimalWidth } from '@/shared/lib/image';
import { borderRadiusNum } from '@/shared/config';

interface PhotoGridProps {
  /** 画像URL配列 */
  images: string[];
  /** 画像タップ時のコールバック（indexを渡す） */
  onImagePress?: (index: number) => void;
  /** 画像間のギャップ（デフォルト: 4） */
  gap?: number;
  /** 4枚以上の横スクロール時の大サイズ画像（デフォルト: 180） */
  scrollLargeSize?: number;
  /** 4枚以上の横スクロール時の小サイズ幅（デフォルト: 120） */
  scrollSmallWidth?: number;
  /** 4枚以上の横スクロール時の小サイズ高さ（デフォルト: 88） */
  scrollSmallHeight?: number;
}

export function PhotoGrid({
  images,
  onImagePress,
  gap = 4,
  scrollLargeSize = 180,
  scrollSmallWidth = 120,
  scrollSmallHeight = 88,
}: PhotoGridProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) setContainerWidth(width);
  }, []);

  if (images.length === 0) {
    return null;
  }

  // 1枚の場合: 横幅いっぱい、1:1.91比率
  if (images.length === 1) {
    const imageWidth = containerWidth || 300;
    const imageHeight = Math.round(imageWidth / 1.91);
    const optimizedUrl = getOptimizedImageUrl(images[0]!, {
      width: getOptimalWidth(imageWidth),
      height: getOptimalWidth(imageHeight),
      quality: 75,
    });

    return (
      <View onLayout={handleLayout}>
        <Pressable
          onPress={() => onImagePress?.(0)}
          className="active:opacity-80"
        >
          <Image
            source={{ uri: optimizedUrl || images[0]! }}
            style={{ width: imageWidth, height: imageHeight, borderRadius: borderRadiusNum.md }}
            contentFit="cover"
            transition={200}
            cachePolicy="disk"
          />
        </Pressable>
      </View>
    );
  }

  // 2枚の場合: 同サイズ横並びで横幅いっぱい
  if (images.length === 2) {
    const itemSize = containerWidth > 0 ? (containerWidth - gap) / 2 : 180;

    return (
      <View onLayout={handleLayout} className="flex-row" style={{ gap }}>
        {images.map((imageUrl, index) => {
          const optimizedUrl = getOptimizedImageUrl(imageUrl, {
            width: getOptimalWidth(itemSize),
            height: getOptimalWidth(itemSize),
            quality: 75,
          });
          return (
            <Pressable
              key={`equal-${index}`}
              onPress={() => onImagePress?.(index)}
              className="active:opacity-80"
            >
              <Image
                source={{ uri: optimizedUrl || imageUrl }}
                style={{ width: itemSize, height: itemSize, borderRadius: borderRadiusNum.md }}
                contentFit="cover"
                transition={200}
                cachePolicy="disk"
              />
            </Pressable>
          );
        })}
      </View>
    );
  }

  // 3枚の場合: 大（60%）+ 小小（40%、縦積み）で横幅いっぱい
  if (images.length === 3) {
    const largeWidth = containerWidth > 0
      ? Math.round((containerWidth - gap) * 0.6)
      : 200;
    const smallColumnWidth = containerWidth > 0
      ? containerWidth - gap - largeWidth
      : 130;
    // 大画像を正方形にして、小画像の高さを確保
    const largeHeight = largeWidth;
    const smallItemHeight = (largeHeight - gap) / 2;

    return (
      <View onLayout={handleLayout} className="flex-row" style={{ gap }}>
        {/* 大画像 */}
        <Pressable
          onPress={() => onImagePress?.(0)}
          className="active:opacity-80"
        >
          <Image
            source={{ uri: getOptimizedImageUrl(images[0]!, { width: getOptimalWidth(largeWidth), height: getOptimalWidth(largeHeight), quality: 75 }) || images[0]! }}
            style={{ width: largeWidth, height: largeHeight, borderRadius: borderRadiusNum.md }}
            contentFit="cover"
            transition={200}
            cachePolicy="disk"
          />
        </Pressable>
        {/* 小画像2枚（縦積み） */}
        <View className="flex-col" style={{ gap }}>
          <Pressable
            onPress={() => onImagePress?.(1)}
            className="active:opacity-80"
          >
            <Image
              source={{ uri: getOptimizedImageUrl(images[1]!, { width: getOptimalWidth(smallColumnWidth), height: getOptimalWidth(smallItemHeight), quality: 75 }) || images[1]! }}
              style={{ width: smallColumnWidth, height: smallItemHeight, borderRadius: borderRadiusNum.md }}
              contentFit="cover"
              transition={200}
              cachePolicy="disk"
            />
          </Pressable>
          <Pressable
            onPress={() => onImagePress?.(2)}
            className="active:opacity-80"
          >
            <Image
              source={{ uri: getOptimizedImageUrl(images[2]!, { width: getOptimalWidth(smallColumnWidth), height: getOptimalWidth(smallItemHeight), quality: 75 }) || images[2]! }}
              style={{ width: smallColumnWidth, height: smallItemHeight, borderRadius: borderRadiusNum.md }}
              contentFit="cover"
              transition={200}
              cachePolicy="disk"
            />
          </Pressable>
        </View>
      </View>
    );
  }

  // 4枚以上: 大→小小パターン（横スクロール、固定サイズ）
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap }}
    >
      {images.map((imageUrl, index) => {
        const patternIndex = index % 3;
        const isLarge = patternIndex === 0;
        const isFirstOfSmallPair = patternIndex === 1;
        const isSecondOfSmallPair = patternIndex === 2;

        if (isFirstOfSmallPair) {
          const nextImageUrl = images[index + 1];

          // ペアの相手がいない場合は大サイズとして描画
          if (!nextImageUrl) {
            const optimizedUrl = getOptimizedImageUrl(imageUrl, {
              width: getOptimalWidth(scrollLargeSize),
              height: getOptimalWidth(scrollLargeSize),
              quality: 75,
            });
            return (
              <Pressable
                key={`large-${index}`}
                onPress={() => onImagePress?.(index)}
                className="active:opacity-80"
              >
                <Image
                  source={{ uri: optimizedUrl || imageUrl }}
                  style={{ width: scrollLargeSize, height: scrollLargeSize, borderRadius: borderRadiusNum.md }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="disk"
                />
              </Pressable>
            );
          }

          const optimizedUrl = getOptimizedImageUrl(imageUrl, {
            width: getOptimalWidth(scrollSmallWidth),
            height: getOptimalWidth(scrollSmallHeight),
            quality: 75,
          });
          const nextOptimizedUrl = getOptimizedImageUrl(nextImageUrl, {
            width: getOptimalWidth(scrollSmallWidth),
            height: getOptimalWidth(scrollSmallHeight),
            quality: 75,
          });
          return (
            <View key={`pair-${index}`} className="flex-col" style={{ gap }}>
              <Pressable
                onPress={() => onImagePress?.(index)}
                className="active:opacity-80"
              >
                <Image
                  source={{ uri: optimizedUrl || imageUrl }}
                  style={{ width: scrollSmallWidth, height: scrollSmallHeight, borderRadius: borderRadiusNum.md }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="disk"
                />
              </Pressable>
              <Pressable
                onPress={() => onImagePress?.(index + 1)}
                className="active:opacity-80"
              >
                <Image
                  source={{ uri: nextOptimizedUrl || nextImageUrl }}
                  style={{ width: scrollSmallWidth, height: scrollSmallHeight, borderRadius: borderRadiusNum.md }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="disk"
                />
              </Pressable>
            </View>
          );
        }

        if (isSecondOfSmallPair) {
          return null;
        }

        if (isLarge) {
          const optimizedUrl = getOptimizedImageUrl(imageUrl, {
            width: getOptimalWidth(scrollLargeSize),
            height: getOptimalWidth(scrollLargeSize),
            quality: 75,
          });
          return (
            <Pressable
              key={`large-${index}`}
              onPress={() => onImagePress?.(index)}
              className="active:opacity-80"
            >
              <Image
                source={{ uri: optimizedUrl || imageUrl }}
                style={{ width: scrollLargeSize, height: scrollLargeSize, borderRadius: borderRadiusNum.md }}
                contentFit="cover"
                transition={200}
                cachePolicy="disk"
              />
            </Pressable>
          );
        }

        return null;
      })}
    </ScrollView>
  );
}
