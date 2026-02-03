/**
 * ImageViewerModal
 *
 * 画像を拡大表示するモーダル
 * - ピンチズーム対応（react-native-zoom-toolkit）
 * - スワイプで画像切り替え
 * - 下スワイプで閉じる
 * - ダブルタップでズームイン/アウト
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Modal,
  Pressable,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Gallery, type TapGestureEvent } from 'react-native-zoom-toolkit';
import { fontSizeNum, borderRadiusNum, iconSizeNum } from '@/shared/config';

// 下スワイプで閉じる閾値
const VERTICAL_PULL_THRESHOLD = 120;

interface ImageViewerModalProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageViewerModal({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: ImageViewerModalProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);

  // 背景透過度（下スワイプ時にフェードアウト）
  const backgroundOpacity = useSharedValue(1);

  // visible/initialIndex変更時のリセット用キー
  const [galleryKey, setGalleryKey] = useState(0);

  // initialIndex が変わったらリセット
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setShowControls(true);
    backgroundOpacity.value = 1;
    setGalleryKey((prev) => prev + 1);
  }, [initialIndex, visible]);

  // インデックス変更時
  const handleIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // タップでコントロール表示/非表示
  const handleTap = useCallback((_event: TapGestureEvent, _index: number) => {
    setShowControls((prev) => !prev);
  }, []);

  // 閉じる
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // 下スワイプで閉じる（worklet）
  const onVerticalPull = useCallback(
    (translateY: number, released: boolean) => {
      'worklet';
      // 背景透過度を距離に応じて変化
      const progress = Math.min(Math.abs(translateY) / VERTICAL_PULL_THRESHOLD, 1);
      backgroundOpacity.value = 1 - progress * 0.6;

      if (released) {
        if (Math.abs(translateY) > VERTICAL_PULL_THRESHOLD) {
          // 閾値を超えたら閉じる
          runOnJS(handleClose)();
        } else {
          // 戻す
          backgroundOpacity.value = withTiming(1, { duration: 200 });
        }
      }
    },
    [handleClose, backgroundOpacity]
  );

  // 背景アニメーションスタイル
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity.value})`,
  }));

  // renderItem
  const renderItem = useCallback(
    (item: string, _index: number) => (
      <Image
        source={{ uri: item }}
        style={{ width: screenWidth, height: screenHeight }}
        resizeMode="contain"
      />
    ),
    [screenWidth, screenHeight]
  );

  // keyExtractor
  const keyExtractor = useCallback(
    (item: string, index: number) => `${item}-${index}`,
    []
  );

  // maxScale（全画像共通で3倍）
  const maxScale = useMemo(
    () => images.map(() => ({ width: screenWidth * 3, height: screenHeight * 3 })),
    [images, screenWidth, screenHeight]
  );

  if (images.length === 0) return null;

  const hasMultiple = images.length > 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <GestureHandlerRootView style={styles.flex}>
        <Animated.View style={[styles.flex, backgroundStyle]}>
          {/* 閉じるボタン */}
          {showControls && (
            <Pressable
              onPress={handleClose}
              style={[styles.closeButton, { top: insets.top + 10 }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={iconSizeNum.lg} color="white" />
            </Pressable>
          )}

          {/* 画像ギャラリー */}
          <Gallery
            key={galleryKey}
            data={images}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            initialIndex={initialIndex}
            onIndexChange={handleIndexChange}
            onTap={handleTap}
            onVerticalPull={onVerticalPull}
            maxScale={maxScale}
          />

          {/* 画像カウンター */}
          {hasMultiple && showControls && (
            <View style={[styles.counter, { bottom: insets.bottom + 20 }]}>
              <Text style={styles.counterText}>
                {currentIndex + 1} / {images.length}
              </Text>
            </View>
          )}

          {/* ページインジケーター（ドット） */}
          {hasMultiple && showControls && images.length <= 10 && (
            <View style={[styles.dots, { bottom: insets.bottom + 60 }]}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

/**
 * 画像ビューアーを使うためのカスタムフック
 * 複数画像対応版
 */
export function useImageViewer() {
  const [images, setImages] = useState<string[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 単一画像を開く
  const openImage = useCallback((imageUrl: string) => {
    setImages([imageUrl]);
    setInitialIndex(0);
    setIsOpen(true);
  }, []);

  // 複数画像を開く（特定のインデックスから）
  const openImages = useCallback((imageUrls: string[], index: number = 0) => {
    setImages(imageUrls);
    setInitialIndex(index);
    setIsOpen(true);
  }, []);

  const closeImage = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    images,
    initialIndex,
    isOpen,
    openImage,
    openImages,
    closeImage,
    // 後方互換性のため
    selectedImage: images[0] || null,
  };
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: borderRadiusNum.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadiusNum.full,
  },
  counterText: {
    color: 'white',
    fontSize: fontSizeNum.sm,
  },
  dots: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadiusNum.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: 'white',
  },
});
