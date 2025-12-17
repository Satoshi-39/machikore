/**
 * スケルトンローディングコンポーネント
 *
 * コンテンツ読み込み中に表示するプレースホルダー
 * アニメーション付きで、読み込み中であることを示す
 */

import React, { useEffect } from 'react';
import { View, type DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SkeletonProps {
  /** 幅（数値またはパーセント文字列） */
  width?: number | string;
  /** 高さ */
  height?: number;
  /** 角丸の半径 */
  borderRadius?: number;
  /** 円形にする（アバター用） */
  circle?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 4,
  circle = false,
  className = '',
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const size = circle ? (typeof width === 'number' ? width : height) : undefined;
  const computedWidth: DimensionValue = circle ? (size ?? height) : (width as DimensionValue);
  const computedHeight = circle ? (size ?? height) : height;

  return (
    <Animated.View
      className={`bg-gray-300 dark:bg-gray-600 ${className}`}
      style={[
        animatedStyle,
        {
          width: computedWidth,
          height: computedHeight,
          borderRadius: circle ? (computedHeight) / 2 : borderRadius,
        },
      ]}
    />
  );
}

/**
 * プロフィールスケルトン
 * MyPageProfileのローディング用
 */
export function ProfileSkeleton() {
  return (
    <View className="bg-surface dark:bg-dark-surface px-4 py-6 border-b border-border dark:border-dark-border">
      {/* アバターとボタン */}
      <View className="flex-row items-center justify-between mb-4">
        {/* アバター */}
        <Skeleton circle width={80} height={80} />
        {/* ボタン */}
        <Skeleton width={100} height={36} borderRadius={18} />
      </View>

      {/* ユーザー名 */}
      <Skeleton width={120} height={24} className="mb-1" />
      {/* ユーザーID */}
      <Skeleton width={80} height={14} className="mb-3" />

      {/* 自己紹介（2行） */}
      <Skeleton width="90%" height={14} className="mb-1" />
      <Skeleton width="60%" height={14} className="mb-3" />

      {/* 統計情報 */}
      <View className="flex-row items-center">
        <Skeleton width={60} height={14} />
        <View className="w-4" />
        <Skeleton width={70} height={14} />
        <View className="w-4" />
        <Skeleton width={80} height={14} />
      </View>
    </View>
  );
}
