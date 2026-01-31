/**
 * ZoomableImage
 *
 * ピンチズームとパン（ドラッグ）に対応した画像コンポーネント
 * react-native-gesture-handler と react-native-reanimated を使用
 */

import React, { useCallback } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// ズームの制限（Instagram風）
const MIN_SCALE = 1;
const MAX_SCALE = 3;
const DOUBLE_TAP_SCALE = 2;

// 下スワイプで閉じるための閾値
const SWIPE_DOWN_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 800;

interface ZoomableImageProps {
  uri: string;
  width?: number;
  height?: number;
  onSwipeDown?: () => void;
  onTap?: () => void;
}

export function ZoomableImage({
  uri,
  width: widthProp,
  height: heightProp,
  onSwipeDown,
  onTap,
}: ZoomableImageProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const width = widthProp ?? screenWidth;
  const height = heightProp ?? screenHeight * 0.8;
  // アニメーション用の共有値
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // 位置をリセット
  const resetPosition = useCallback(() => {
    'worklet';
    scale.value = withTiming(1, { duration: 200 });
    savedScale.value = 1;
    translateX.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(0, { duration: 200 });
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, []);

  // 境界内に位置を制限
  const clampTranslate = useCallback(
    (value: number, dimension: number, currentScale: number) => {
      'worklet';
      const maxTranslate = Math.max(0, (dimension * currentScale - dimension) / 2);
      return Math.min(Math.max(value, -maxTranslate), maxTranslate);
    },
    []
  );

  // ピンチジェスチャー
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = Math.min(Math.max(savedScale.value * e.scale, MIN_SCALE * 0.5), MAX_SCALE);
      scale.value = newScale;
    })
    .onEnd(() => {
      // 最小スケール以下なら元に戻す
      if (scale.value < MIN_SCALE) {
        resetPosition();
      } else if (scale.value > MAX_SCALE) {
        scale.value = withTiming(MAX_SCALE, { duration: 200 });
        savedScale.value = MAX_SCALE;
      } else {
        savedScale.value = scale.value;
      }
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // パンジェスチャー（ドラッグ）
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        // ズーム中はパン（画像を動かす）
        const newTranslateX = savedTranslateX.value + e.translationX;
        const newTranslateY = savedTranslateY.value + e.translationY;
        translateX.value = clampTranslate(newTranslateX, width, scale.value);
        translateY.value = clampTranslate(newTranslateY, height, scale.value);
      } else {
        // ズームなし: 縦方向のみ追跡（下スワイプで閉じる用）
        // 横方向は FlatList に任せるため無視
        if (e.translationY > 0) {
          translateY.value = e.translationY * 0.5; // 抵抗感を出す
        }
      }
    })
    .onEnd((e) => {
      if (scale.value > 1) {
        // ズーム中は位置を保存
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      } else {
        // ズームなし: 下スワイプ判定
        const { translationY, velocityY } = e;

        if (
          translationY > SWIPE_DOWN_THRESHOLD ||
          (velocityY > VELOCITY_THRESHOLD && translationY > 30)
        ) {
          if (onSwipeDown) {
            runOnJS(onSwipeDown)();
          }
        }

        // 位置をリセット
        translateY.value = withTiming(0, { duration: 200 });
      }
    })
    // 横方向の動きが大きい場合はジェスチャーを失敗させる（FlatListに任せる）
    .activeOffsetY([-10, 10])
    .failOffsetX([-20, 20]);

  // ダブルタップでズームイン/アウト
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      if (scale.value > 1) {
        // ズーム中ならリセット
        resetPosition();
      } else {
        // ズームなしなら2倍にズーム
        scale.value = withTiming(DOUBLE_TAP_SCALE, { duration: 200 });
        savedScale.value = DOUBLE_TAP_SCALE;

        // タップした位置を中心にズーム
        const centerX = width / 2;
        const centerY = height / 2;
        const offsetX = (centerX - e.x) * (DOUBLE_TAP_SCALE - 1);
        const offsetY = (centerY - e.y) * (DOUBLE_TAP_SCALE - 1);
        const clampedX = clampTranslate(offsetX, width, DOUBLE_TAP_SCALE);
        const clampedY = clampTranslate(offsetY, height, DOUBLE_TAP_SCALE);
        translateX.value = withTiming(clampedX, { duration: 200 });
        translateY.value = withTiming(clampedY, { duration: 200 });
        savedTranslateX.value = clampedX;
        savedTranslateY.value = clampedY;
      }
    });

  // シングルタップ（UI表示/非表示切替）
  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      if (onTap) {
        runOnJS(onTap)();
      }
    });

  // ジェスチャーを組み合わせ
  // ピンチとパンは同時に動作可能
  // ダブルタップとシングルタップは排他的（ダブルタップ優先）
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    Gesture.Exclusive(doubleTapGesture, singleTapGesture)
  );

  // アニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.container, { width, height }]}>
        <Animated.Image
          source={{ uri }}
          style={[styles.image, { width, height }, animatedStyle]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    // 画像のスタイル
  },
});
