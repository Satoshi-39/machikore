/**
 * 画像クロップモーダル
 *
 * CropZoomを使用して画像をクロップする全画面モーダル
 * - ピンチ/パンで画像位置を調整
 * - 固定アスペクト比（デフォルト1.91:1）のフレーム
 * - フレーム外を半透明オーバーレイで暗くする
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  Image,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CropZoom } from 'react-native-zoom-toolkit';
import type { CropZoomRefType } from 'react-native-zoom-toolkit';
import { cropImage, type CropResult } from '@/shared/lib/image';
import { fontSizeNum, fontWeight as fontWeightTokens } from '@/shared/config';
import { log } from '@/shared/config/logger';

/** デフォルトのアスペクト比（1.91:1 = OGP/SNS推奨） */
const DEFAULT_ASPECT_RATIO = 1.91;

/** オーバーレイの暗さ */
const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.6)';

interface CropModalProps {
  visible: boolean;
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  /** クロップ領域のアスペクト比（幅/高さ）。デフォルト: 1.91 */
  aspectRatio?: number;
  onComplete: (result: CropResult) => void;
  onCancel: () => void;
}

export function CropModal({
  visible,
  imageUri,
  imageWidth,
  imageHeight,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  onComplete,
  onCancel,
}: CropModalProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const cropRef = useRef<CropZoomRefType>(null);
  const [isCropping, setIsCropping] = useState(false);

  // ヘッダー高さの見積もり
  const headerHeight = insets.top + 8 + 20 + 12; // paddingTop + text + paddingBottom
  const footerHeight = insets.bottom + 16;
  // CropZoomコンテナの利用可能な高さ
  const containerHeight = screenHeight - headerHeight - footerHeight;

  // クロップ領域のサイズを計算（画面幅いっぱい、余白あり）
  const cropPadding = 16;
  const cropWidth = screenWidth - cropPadding * 2;
  const cropHeight = cropWidth / aspectRatio;

  // オーバーレイの上下の暗い領域の高さ
  // CropZoomはコンテナ中央にcropSizeを配置する
  const topOverlayHeight = (containerHeight - cropHeight) / 2;
  const bottomOverlayHeight = topOverlayHeight;

  const handleCrop = useCallback(async () => {
    if (!cropRef.current || isCropping) return;

    setIsCropping(true);
    try {
      const result = cropRef.current.crop();
      const cropped = await cropImage(imageUri, result, 0.8);
      onComplete(cropped);
    } catch (error) {
      log.error('[CropModal] クロップエラー:', error);
    } finally {
      setIsCropping(false);
    }
  }, [imageUri, onComplete, isCropping]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  // オーバーレイコンポーネント（CropZoom全体をカバーし、クロップ枠外を暗くする）
  const OverlayComponent = useCallback(() => {
    return (
      <View style={{ width: screenWidth, height: containerHeight }} pointerEvents="none">
        {/* 上部の暗いエリア */}
        <View style={{ width: screenWidth, height: Math.max(0, topOverlayHeight), backgroundColor: OVERLAY_COLOR }} />
        {/* 中央の行: 左暗い | クロップ枠（透明 + 罫線）| 右暗い */}
        <View style={{ flexDirection: 'row', height: cropHeight }}>
          <View style={{ width: cropPadding, backgroundColor: OVERLAY_COLOR }} />
          <View style={{ width: cropWidth, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)' }} />
          <View style={{ width: cropPadding, backgroundColor: OVERLAY_COLOR }} />
        </View>
        {/* 下部の暗いエリア */}
        <View style={{ width: screenWidth, height: Math.max(0, bottomOverlayHeight), backgroundColor: OVERLAY_COLOR }} />
      </View>
    );
  }, [screenWidth, containerHeight, cropWidth, cropHeight, cropPadding, topOverlayHeight, bottomOverlayHeight]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <GestureHandlerRootView style={styles.flex}>
        <View style={styles.container}>
          {/* ヘッダー */}
          <View
            style={[
              styles.header,
              { paddingTop: insets.top + 8 },
            ]}
          >
            <Pressable
              onPress={handleCancel}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>キャンセル</Text>
            </Pressable>

            <Text style={styles.headerTitle}>編集</Text>

            <Pressable
              onPress={handleCrop}
              disabled={isCropping}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.headerButton}
            >
              {isCropping ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.headerButtonTextBold}>完了</Text>
              )}
            </Pressable>
          </View>

          {/* クロップエリア */}
          <View style={[styles.cropContainer, { overflow: 'hidden' }]}>
            <CropZoom
              ref={cropRef}
              cropSize={{ width: cropWidth, height: cropHeight }}
              resolution={{ width: imageWidth, height: imageHeight }}
              minScale={1}
              maxScale={5}
              OverlayComponent={OverlayComponent}
            >
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMethod="scale"
              />
            </CropZoom>
          </View>

          {/* フッター（余白） */}
          <View style={{ height: footerHeight }} />
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerButton: {
    minWidth: 72,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: fontSizeNum.lg,
    fontWeight: fontWeightTokens.semibold,
  },
  headerButtonText: {
    color: 'white',
    fontSize: fontSizeNum.base,
  },
  headerButtonTextBold: {
    color: 'white',
    fontSize: fontSizeNum.base,
    fontWeight: fontWeightTokens.semibold,
  },
  cropContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
