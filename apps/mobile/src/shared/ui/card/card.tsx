/**
 * Cardコンポーネント
 *
 * react-native-reusablesパターンに基づいたカードUI
 * shadcn/uiのCard構造をReact Native向けに実装
 */

import * as React from 'react';
import { View, Text, type ViewProps, type TextProps } from 'react-native';
import { cn } from '@/shared/lib/utils';

const Card = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      'rounded-xl border-thin border-outline bg-surface',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('p-4', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<Text, TextProps>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-6 text-on-surface',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<Text, TextProps>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn('text-sm text-on-surface-variant', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('p-4 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex-row items-center p-4 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
