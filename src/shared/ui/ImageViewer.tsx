/**
 * ImageViewerModal
 *
 * 画像を拡大表示するモーダル
 * 単一画像・複数画像両対応、前後ナビゲーション付き
 */

import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  Modal,
  Pressable,
  Image,
  Text,
  Dimensions,
  StatusBar,
  ActivityIndicator,
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
  // 表示中のインデックス（UIに反映される）
  const [displayIndex, setDisplayIndex] = useState(initialIndex);
  // 読み込み中かどうか
  const [isLoading, setIsLoading] = useState(false);
  // 次に表示するインデックス（プリロード用）
  const pendingIndexRef = useRef<number | null>(null);

  // initialIndex が変わったら displayIndex を更新
  React.useEffect(() => {
    setDisplayIndex(initialIndex);
    setIsLoading(false);
    pendingIndexRef.current = null;
  }, [initialIndex, visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handlePrev = useCallback((e: any) => {
    e.stopPropagation();
    if (displayIndex > 0 && !isLoading) {
      const newIndex = displayIndex - 1;
      pendingIndexRef.current = newIndex;
      setIsLoading(true);
      // 画像をプリロード
      Image.prefetch(images[newIndex]!).then(() => {
        if (pendingIndexRef.current === newIndex) {
          setDisplayIndex(newIndex);
          pendingIndexRef.current = null;
          setIsLoading(false);
        }
      }).catch(() => {
        // エラーでも表示を更新
        if (pendingIndexRef.current === newIndex) {
          setDisplayIndex(newIndex);
          pendingIndexRef.current = null;
          setIsLoading(false);
        }
      });
    }
  }, [displayIndex, images, isLoading]);

  const handleNext = useCallback((e: any) => {
    e.stopPropagation();
    if (displayIndex < images.length - 1 && !isLoading) {
      const newIndex = displayIndex + 1;
      pendingIndexRef.current = newIndex;
      setIsLoading(true);
      // 画像をプリロード
      Image.prefetch(images[newIndex]!).then(() => {
        if (pendingIndexRef.current === newIndex) {
          setDisplayIndex(newIndex);
          pendingIndexRef.current = null;
          setIsLoading(false);
        }
      }).catch(() => {
        // エラーでも表示を更新
        if (pendingIndexRef.current === newIndex) {
          setDisplayIndex(newIndex);
          pendingIndexRef.current = null;
          setIsLoading(false);
        }
      });
    }
  }, [displayIndex, images, isLoading]);

  if (images.length === 0) return null;

  const currentImage = images[displayIndex];
  const hasMultiple = images.length > 1;
  const canGoPrev = displayIndex > 0;
  const canGoNext = displayIndex < images.length - 1;

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

        {/* 読み込み中インジケーター */}
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        {/* 複数画像の場合のナビゲーション */}
        {hasMultiple && (
          <>
            {/* 前へボタン - 常に表示、最初の画像または読み込み中は非活性 */}
            <Pressable
              onPress={handlePrev}
              disabled={!canGoPrev || isLoading}
              className="absolute left-4 w-12 h-12 bg-black/50 rounded-full items-center justify-center active:bg-black/70"
              style={{
                top: '50%',
                marginTop: -24,
                opacity: !canGoPrev || isLoading ? 0.3 : 1,
              }}
            >
              <Ionicons name="chevron-back" size={28} color="white" />
            </Pressable>

            {/* 次へボタン - 常に表示、最後の画像または読み込み中は非活性 */}
            <Pressable
              onPress={handleNext}
              disabled={!canGoNext || isLoading}
              className="absolute right-4 w-12 h-12 bg-black/50 rounded-full items-center justify-center active:bg-black/70"
              style={{
                top: '50%',
                marginTop: -24,
                opacity: !canGoNext || isLoading ? 0.3 : 1,
              }}
            >
              <Ionicons name="chevron-forward" size={28} color="white" />
            </Pressable>

            {/* 画像カウンター */}
            <View
              className="absolute bg-black/50 px-4 py-2 rounded-full"
              style={{ bottom: insets.bottom + 20, alignSelf: 'center' }}
            >
              <Text className="text-white text-sm">
                {displayIndex + 1} / {images.length}
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
