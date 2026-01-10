/**
 * Text コンポーネント
 *
 * react-native-reusables 形式のTextコンポーネント
 * Button内で使用する際にbuttonTextVariantsと組み合わせて使用
 */

import * as React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cn } from '@/shared/lib/utils';

interface TextProps extends RNTextProps {
  className?: string;
}

const Text = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <RNText
        ref={ref}
        className={cn('text-foreground dark:text-dark-foreground', className)}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text };
export type { TextProps };
