/**
 * Button コンポーネント
 *
 * react-native-reusables 形式のButtonコンポーネント
 * cva (class-variance-authority) を使用してバリアントを管理
 *
 * 使用方法:
 * <Button onPress={...}>
 *   <Text className={buttonTextVariants()}>ラベル</Text>
 * </Button>
 *
 * ローディング状態:
 * <Button disabled={isLoading}>
 *   {isLoading ? <ActivityIndicator color="white" /> : <Text>送信</Text>}
 * </Button>
 */

import * as React from 'react';
import { Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { colors } from '@/shared/config';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        primary: 'bg-primary',
        secondary: 'border-2 border-primary bg-transparent',
        destructive: 'bg-red-500',
        outline: 'border border-outline bg-transparent',
        ghost: 'bg-transparent',
        link: 'bg-transparent',
      },
      size: {
        default: 'py-4 px-6',
        sm: 'py-2 px-4',
        lg: 'py-5 px-8',
        icon: 'p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('font-semibold text-base', {
  variants: {
    variant: {
      default: 'text-white',
      primary: 'text-white',
      secondary: 'text-primary',
      destructive: 'text-white',
      outline: 'text-on-surface',
      ghost: 'text-on-surface',
      link: 'text-primary underline',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
type ButtonSize = VariantProps<typeof buttonVariants>['size'];

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  style?: ViewStyle;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      disabled,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isFilledVariant =
      variant === 'default' || variant === 'primary' || variant === 'destructive';

    // シャドウスタイル（primary/destructive のみ）
    const shadowStyle: ViewStyle =
      isFilledVariant && !disabled
        ? {
            shadowColor: variant === 'destructive' ? '#EF4444' : colors.primary.DEFAULT,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }
        : {};

    // disabled時のスタイル
    const disabledClass = disabled ? 'bg-secondary border-0' : '';

    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size }), disabledClass, className)}
        style={[shadowStyle, style]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, buttonTextVariants };
export type { ButtonProps, ButtonVariant, ButtonSize };
