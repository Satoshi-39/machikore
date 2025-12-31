/**
 * ImageGallery
 *
 * 複数画像のスワイプナビゲーション対応ギャラリー
 * - 横スワイプ: FlatList のページングで画像切り替え
 * - 各画像: ピンチズーム・ダブルタップ・下スワイプで閉じる
 */

import React, { useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  ViewToken,
} from 'react-native';
import { ZoomableImage } from './ZoomableImage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  onClose?: () => void;
  onTap?: () => void;
  imageHeight?: number;
}

export function ImageGallery({
  images,
  initialIndex = 0,
  onIndexChange,
  onClose,
  onTap,
  imageHeight = SCREEN_HEIGHT * 0.8,
}: ImageGalleryProps) {
  const flatListRef = useRef<FlatList>(null);

  // 画像の表示状態が変わったときに呼ばれる
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstItem = viewableItems[0];
      if (viewableItems.length > 0 && firstItem?.index != null) {
        onIndexChange?.(firstItem.index);
      }
    },
    [onIndexChange]
  );

  // viewabilityConfig は再レンダリング時に変わらないようにする
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // 画像をレンダリング
  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={[styles.imageContainer, { width: SCREEN_WIDTH }]}>
        <ZoomableImage
          uri={item}
          width={SCREEN_WIDTH}
          height={imageHeight}
          onSwipeDown={onClose}
          onTap={onTap}
        />
      </View>
    ),
    [imageHeight, onClose, onTap]
  );

  // キー抽出
  const keyExtractor = useCallback(
    (item: string, index: number) => `${item}-${index}`,
    []
  );

  // スクロール失敗時のフォールバック
  const onScrollToIndexFailed = useCallback(
    (info: { index: number; highestMeasuredFrameIndex: number }) => {
      const wait = new Promise((resolve) => setTimeout(resolve, 100));
      wait.then(() => {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: false,
        });
      });
    },
    []
  );

  // getItemLayout でパフォーマンス最適化
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={getItemLayout}
        // スクロール中のパフォーマンス最適化
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        // 端でのバウンスを無効化
        bounces={false}
        // スクロールの減速を速めに（よりスナップ感を出す）
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
