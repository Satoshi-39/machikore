/**
 * Switchコンポーネント
 *
 * react-native-reusablesパターンに基づいたアクセシブルなスイッチUI
 * @rn-primitives/switchを使用
 */

import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/shared/lib/utils';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

const AnimatedView = Animated.createAnimatedComponent(View);

export interface SwitchProps {
  /** 現在の状態 */
  checked: boolean;
  /** 状態変更時のコールバック */
  onCheckedChange: (checked: boolean) => void;
  /** 無効状態 */
  disabled?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: ViewStyle;
  /** トラックのアクティブカラー（デフォルト: primary） */
  activeColor?: string;
  /** トラックの非アクティブカラー */
  inactiveColor?: string;
}

const SWITCH_WIDTH = 51;
const SWITCH_HEIGHT = 31;
const THUMB_SIZE = 27;
const THUMB_MARGIN = 2;
const THUMB_TRANSLATE = SWITCH_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2;

export const Switch = React.forwardRef<View, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      disabled = false,
      className,
      style,
      activeColor,
      inactiveColor,
    },
    ref
  ) => {
    const isDarkMode = useIsDarkMode();

    // カラー設定
    const trackActiveColor = activeColor ?? colors.primary.DEFAULT;
    const trackInactiveColor = inactiveColor ?? (isDarkMode ? colors.gray[600] : colors.gray[300]);

    // アニメーション値
    const progress = useDerivedValue(() => {
      return withTiming(checked ? 1 : 0, { duration: 200 });
    }, [checked]);

    // トラックのアニメーションスタイル
    const animatedTrackStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          progress.value,
          [0, 1],
          [trackInactiveColor, trackActiveColor]
        ),
      };
    });

    // サムのアニメーションスタイル
    const animatedThumbStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: withTiming(checked ? THUMB_TRANSLATE : 0, {
              duration: 200,
            }),
          },
        ],
      };
    });

    const handlePress = React.useCallback(() => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    }, [disabled, checked, onCheckedChange]);

    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled }}
        style={style}
      >
        <AnimatedView
          className={cn(
            'rounded-full justify-center',
            disabled && 'opacity-50',
            className
          )}
          style={[
            {
              width: SWITCH_WIDTH,
              height: SWITCH_HEIGHT,
            },
            animatedTrackStyle,
          ]}
        >
          <AnimatedView
            className="bg-white rounded-full shadow-sm"
            style={[
              {
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                marginLeft: THUMB_MARGIN,
              },
              animatedThumbStyle,
            ]}
          />
        </AnimatedView>
      </Pressable>
    );
  }
);

Switch.displayName = 'Switch';
