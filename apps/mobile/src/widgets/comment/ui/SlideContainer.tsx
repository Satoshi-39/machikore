/**
 * SlideContainer Widget
 *
 * 横スライドアニメーションで2つのビューを切り替えるコンテナ
 * メインビュー ⇔ 詳細ビュー の遷移に使用
 *
 * 絶対配置を使用してFlatListのスクロールを正しく動作させる
 */

import React, { useEffect } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { duration as durationTokens } from '@/shared/config';

interface SlideContainerProps {
  /** メインビュー（左側） */
  mainView: React.ReactNode;
  /** 詳細ビュー（右側） - nullの場合はメインビューのみ表示 */
  detailView: React.ReactNode | null;
  /** 詳細ビューを表示するかどうか */
  showDetail: boolean;
  /** アニメーション時間（ms） */
  duration?: number;
}

const ANIMATION_CONFIG = {
  duration: durationTokens.slow,
  easing: Easing.out(Easing.cubic),
};

export function SlideContainer({
  mainView,
  detailView,
  showDetail,
  duration = ANIMATION_CONFIG.duration,
}: SlideContainerProps) {
  const { width } = useWindowDimensions();
  const mainTranslateX = useSharedValue(0);
  const detailTranslateX = useSharedValue(width);

  useEffect(() => {
    if (showDetail) {
      mainTranslateX.value = withTiming(-width, {
        duration,
        easing: ANIMATION_CONFIG.easing,
      });
      detailTranslateX.value = withTiming(0, {
        duration,
        easing: ANIMATION_CONFIG.easing,
      });
    } else {
      mainTranslateX.value = withTiming(0, {
        duration,
        easing: ANIMATION_CONFIG.easing,
      });
      detailTranslateX.value = withTiming(width, {
        duration,
        easing: ANIMATION_CONFIG.easing,
      });
    }
  }, [showDetail, width, mainTranslateX, detailTranslateX, duration]);

  const mainStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: mainTranslateX.value }],
  }));

  const detailStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: detailTranslateX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* メインビュー */}
      <Animated.View style={[styles.absoluteView, mainStyle]}>
        {mainView}
      </Animated.View>

      {/* 詳細ビュー */}
      <Animated.View style={[styles.absoluteView, detailStyle]}>
        {detailView}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  absoluteView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
