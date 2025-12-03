/**
 * ImageViewerModal
 *
 * 画像を拡大表示するモーダル
 * 単一画像・複数画像両対応、前後ナビゲーション付き
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Modal,
  Pressable,
  Image,
  Text,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

  // initialIndex が変わったら currentIndex を更新
  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handlePrev = useCallback((e: any) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback((e: any) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images.length]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];
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
      <View className="flex-1 bg-black">
        {/* 閉じるボタン */}
        <Pressable
          onPress={handleClose}
          style={{ top: insets.top + 10, right: 16 }}
          className="absolute z-10 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="white" />
        </Pressable>

        {/* 画像 */}
        <Pressable
          onPress={handleClose}
          className="flex-1 justify-center items-center"
        >
          <Image
            source={{ uri: currentImage }}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.8,
            }}
            resizeMode="contain"
          />
        </Pressable>

        {/* 複数画像の場合のナビゲーション */}
        {hasMultiple && (
          <>
            {/* 前へボタン */}
            {currentIndex > 0 && (
              <Pressable
                onPress={handlePrev}
                className="absolute left-4 w-10 h-10 bg-surface dark:bg-dark-surface/20 rounded-full items-center justify-center"
                style={{ top: '50%', marginTop: -20 }}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </Pressable>
            )}

            {/* 次へボタン */}
            {currentIndex < images.length - 1 && (
              <Pressable
                onPress={handleNext}
                className="absolute right-4 w-10 h-10 bg-surface dark:bg-dark-surface/20 rounded-full items-center justify-center"
                style={{ top: '50%', marginTop: -20 }}
              >
                <Ionicons name="chevron-forward" size={24} color="white" />
              </Pressable>
            )}

            {/* 画像カウンター */}
            <View
              className="absolute bg-black/50 px-4 py-2 rounded-full"
              style={{ bottom: insets.bottom + 20, alignSelf: 'center' }}
            >
              <Text className="text-white text-sm">
                {currentIndex + 1} / {images.length}
              </Text>
            </View>
          </>
        )}
      </View>
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
