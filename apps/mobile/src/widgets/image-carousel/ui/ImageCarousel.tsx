/**
 * Instagram風の画像カルーセル
 *
 * 横スワイプで画像を切り替え、ページインジケーター（ドット）を表示
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  Pressable,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

interface ImageCarouselProps {
  /** 画像URL配列 */
  images: string[];
  /** カルーセルの幅 */
  width: number;
  /** カルーセルの高さ（省略時はwidthと同じ） */
  height?: number;
  /** 画像タップ時のコールバック（タップした画像のインデックス） */
  onImagePress?: (index: number) => void;
  /** 角丸（デフォルト: 8） */
  borderRadius?: number;
}

export function ImageCarousel({
  images,
  width,
  height,
  onImagePress,
  borderRadius = 8,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageHeight = height ?? width;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);
      if (index !== currentIndex && index >= 0 && index < images.length) {
        setCurrentIndex(index);
      }
    },
    [width, currentIndex, images.length]
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <View style={{ width, height: imageHeight }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={{ width, height: imageHeight }}
      >
        {images.map((uri, index) => (
          <Pressable
            key={`${uri}-${index}`}
            onPress={() => onImagePress?.(index)}
            style={{ width, height: imageHeight }}
          >
            <Image
              source={{ uri }}
              style={{
                width,
                height: imageHeight,
                borderRadius,
              }}
              resizeMode="cover"
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* ページインジケーター（2枚以上の場合のみ表示） */}
      {images.length > 1 && (
        <View
          className="absolute bottom-2 left-0 right-0 flex-row justify-center"
          pointerEvents="none"
        >
          {images.map((_, index) => (
            <View
              key={index}
              className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
