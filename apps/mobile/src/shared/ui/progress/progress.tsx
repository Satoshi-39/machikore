/**
 * Progressコンポーネント
 *
 * react-native-reusablesパターンに基づいたプログレスバーUI
 * @rn-primitives/progressを使用
 */

import * as ProgressPrimitive from '@rn-primitives/progress';
import * as React from 'react';
import { View } from 'react-native';
import { cn } from '@/shared/lib/utils';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** 現在の値（0-100、またはmax指定時は0-max） */
  value?: number | null;
  /** 最大値（デフォルト: 100） */
  max?: number;
  /** カスタムクラス名 */
  className?: string;
  /** インジケーターのクラス名 */
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
  // 値のパーセンテージを計算
  const percentage = value != null ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-dark-muted',
        className
      )}
      value={value}
      max={max}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild>
        <View
          className={cn('h-full bg-primary rounded-full', indicatorClassName)}
          style={{ width: `${percentage}%` }}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = 'Progress';

export { Progress };
