/**
 * Skeletonコンポーネント
 *
 * react-native-reusablesパターンに基づいたスケルトンローディングUI
 * コンテンツ読み込み中に表示するプレースホルダー
 */

import * as React from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/shared/lib/utils';

export interface SkeletonProps {
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: ViewStyle;
}

/**
 * 基本のSkeletonコンポーネント
 * classNameでサイズや形状を指定する
 *
 * @example
 * // 基本的な使用法
 * <Skeleton className="h-4 w-full" />
 *
 * // 円形（アバター用）
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * // カード型
 * <Skeleton className="h-32 w-full rounded-lg" />
 */
const Skeleton = React.forwardRef<View, SkeletonProps>(
  ({ className, style }, ref) => {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
      opacity.value = withRepeat(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        ref={ref}
        className={cn(
          'bg-muted dark:bg-dark-muted rounded',
          className
        )}
        style={[animatedStyle, style]}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };

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
        <Skeleton className="w-20 h-20 rounded-full" />
        {/* ボタン */}
        <Skeleton className="w-[100px] h-9 rounded-full" />
      </View>

      {/* ユーザー名 */}
      <Skeleton className="w-[120px] h-6 mb-1" />
      {/* ユーザーID */}
      <Skeleton className="w-20 h-3.5 mb-3" />

      {/* 自己紹介（2行） */}
      <Skeleton className="w-[90%] h-3.5 mb-1" />
      <Skeleton className="w-[60%] h-3.5 mb-3" />

      {/* 統計情報 */}
      <View className="flex-row items-center gap-4">
        <Skeleton className="w-[60px] h-3.5" />
        <Skeleton className="w-[70px] h-3.5" />
        <Skeleton className="w-20 h-3.5" />
      </View>
    </View>
  );
}
