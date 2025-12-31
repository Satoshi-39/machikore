/**
 * ImageViewerModal
 *
 * 画像を拡大表示するモーダル
 * - ピンチズーム対応
 * - スワイプで画像切り替え
 * - 下スワイプで閉じる
 * - ダブルタップでズームイン/アウト
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Modal,
  Pressable,
  Text,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ImageGallery } from './ImageGallery';

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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);

  // initialIndex が変わったらリセット
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setShowControls(true);
  }, [initialIndex, visible]);

  // インデックス変更時
  const handleIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // タップでコントロール表示/非表示
  const handleTap = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  // 閉じる
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

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
      <GestureHandlerRootView style={styles.container}>
        {/* 閉じるボタン */}
        {showControls && (
          <Pressable
            onPress={handleClose}
            style={[styles.closeButton, { top: insets.top + 10 }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
        )}

        {/* 画像ギャラリー */}
        <ImageGallery
          images={images}
          initialIndex={initialIndex}
          onIndexChange={handleIndexChange}
          onClose={handleClose}
          onTap={handleTap}
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
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
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
    borderRadius: 20,
  },
  counterText: {
    color: 'white',
    fontSize: 14,
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
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: 'white',
  },
});
