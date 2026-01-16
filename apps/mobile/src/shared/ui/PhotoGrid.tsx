/**
 * Google Maps風 写真グリッドコンポーネント
 *
 * FSD: shared/ui - 汎用的な写真表示UI
 *
 * パターン: 大 → 小小（縦積み） → 大 → 小小... の繰り返し横スクロール
 */

import React from 'react';
import { View, Image, Pressable, ScrollView } from 'react-native';

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
          return (
            <View key={`pair-${index}`} className="flex-col" style={{ gap }}>
              <Pressable
                onPress={() => onImagePress?.(index)}
                className="active:opacity-80"
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: smallWidth, height: smallHeight }}
                  className="rounded-lg"
                  resizeMode="cover"
                />
              </Pressable>
              {nextImageUrl && (
                <Pressable
                  onPress={() => onImagePress?.(index + 1)}
                  className="active:opacity-80"
                >
                  <Image
                    source={{ uri: nextImageUrl }}
                    style={{ width: smallWidth, height: smallHeight }}
                    className="rounded-lg"
                    resizeMode="cover"
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

        // 大サイズの画像
        if (isLarge) {
          return (
            <Pressable
              key={`large-${index}`}
              onPress={() => onImagePress?.(index)}
              className="active:opacity-80"
            >
              <Image
                source={{ uri: imageUrl }}
                style={{ width: largeSize, height: largeSize }}
                className="rounded-lg"
                resizeMode="cover"
              />
            </Pressable>
          );
        }

        return null;
      })}
    </ScrollView>
  );
}
