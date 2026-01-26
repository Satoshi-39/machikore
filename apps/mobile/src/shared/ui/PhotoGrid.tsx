/**
 * Google Maps風 写真グリッドコンポーネント
 *
 * FSD: shared/ui - 汎用的な写真表示UI
 *
 * レイアウトパターン:
 * - 1枚: 大サイズ1枚
 * - 2枚: 同サイズ横並び
 * - 3枚以上: 大 → 小小（縦積み） → 大 → 小小... の繰り返し横スクロール
 */

import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { getOptimizedImageUrl, getOptimalWidth } from '@/shared/lib/image';
import { borderRadiusNum } from '@/shared/config';

interface PhotoGridProps {
  /** 画像URL配列 */
  images: string[];
  /** 画像タップ時のコールバック（indexを渡す） */
  onImagePress?: (index: number) => void;
  /** 大サイズ画像の幅・高さ（デフォルト: 180） */
  largeSize?: number;
  /** 小サイズ画像の幅（デフォルト: 120） */
  smallWidth?: number;
  /** 小サイズ画像の高さ（デフォルト: 88） */
  smallHeight?: number;
  /** 画像間のギャップ（デフォルト: 4） */
  gap?: number;
}

export function PhotoGrid({
  images,
  onImagePress,
  largeSize = 180,
  smallWidth = 120,
  smallHeight = 88,
  gap = 4,
}: PhotoGridProps) {
  if (images.length === 0) {
    return null;
  }

  // 2枚の場合: 同サイズ横並び
  if (images.length === 2) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap }}
      >
        {images.map((imageUrl, index) => {
          const optimizedUrl = getOptimizedImageUrl(imageUrl, {
            width: getOptimalWidth(largeSize),
            height: getOptimalWidth(largeSize),
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
                style={{ width: largeSize, height: largeSize, borderRadius: borderRadiusNum.md }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </Pressable>
          );
        })}
      </ScrollView>
    );
  }

  // 1枚または3枚以上: 大→小小パターン
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap }}
    >
      {images.map((imageUrl, index) => {
        // パターン: 0=大, 1-2=小小, 3=大, 4-5=小小, 6=大...
        const patternIndex = index % 3;
        const isLarge = patternIndex === 0;
        const isFirstOfSmallPair = patternIndex === 1;
        const isSecondOfSmallPair = patternIndex === 2;

        // 小サイズペアの最初の画像の場合、次の画像と一緒に縦積みで表示
        if (isFirstOfSmallPair) {
          const nextImageUrl = images[index + 1];
          const optimizedUrl = getOptimizedImageUrl(imageUrl, {
            width: getOptimalWidth(smallWidth),
            height: getOptimalWidth(smallHeight),
            quality: 75,
          });
          const nextOptimizedUrl = nextImageUrl
            ? getOptimizedImageUrl(nextImageUrl, {
                width: getOptimalWidth(smallWidth),
                height: getOptimalWidth(smallHeight),
                quality: 75,
              })
            : null;
          return (
            <View key={`pair-${index}`} className="flex-col" style={{ gap }}>
              <Pressable
                onPress={() => onImagePress?.(index)}
                className="active:opacity-80"
              >
                <Image
                  source={{ uri: optimizedUrl || imageUrl }}
                  style={{ width: smallWidth, height: smallHeight, borderRadius: borderRadiusNum.md }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </Pressable>
              {nextImageUrl && (
                <Pressable
                  onPress={() => onImagePress?.(index + 1)}
                  className="active:opacity-80"
                >
                  <Image
                    source={{ uri: nextOptimizedUrl || nextImageUrl }}
                    style={{ width: smallWidth, height: smallHeight, borderRadius: borderRadiusNum.md }}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                </Pressable>
              )}
            </View>
          );
        }

        // 小サイズペアの2番目はスキップ（上で処理済み）
        if (isSecondOfSmallPair) {
          return null;
        }

        // 大サイズの画像（正方形）
        if (isLarge) {
          const optimizedUrl = getOptimizedImageUrl(imageUrl, {
            width: getOptimalWidth(largeSize),
            height: getOptimalWidth(largeSize),
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
                style={{ width: largeSize, height: largeSize, borderRadius: borderRadiusNum.md }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </Pressable>
          );
        }

        return null;
      })}
    </ScrollView>
  );
}
