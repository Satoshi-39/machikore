/**
 * Avatarコンポーネント
 *
 * react-native-reusablesパターンに基づいたアバターUI
 * @rn-primitives/avatarを使用
 */

import * as AvatarPrimitive from '@rn-primitives/avatar';
import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/shared/lib/utils';
import { colors } from '@/shared/config';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted dark:bg-dark-muted',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/**
 * デフォルトのアバターアイコン（人型）
 * AvatarFallback内で使用
 */
interface AvatarIconProps {
  size?: number;
  color?: string;
}

function AvatarIcon({ size = 20, color = colors.gray[500] }: AvatarIconProps) {
  return <Ionicons name="person" size={size} color={color} />;
}

/**
 * ユーザーアバターの便利コンポーネント
 * URLがあれば画像、なければデフォルトアイコンを表示
 */
interface UserAvatarProps {
  /** アバター画像URL */
  url?: string | null;
  /** 代替テキスト */
  alt?: string;
  /** サイズクラス（w-10 h-10 など） */
  className?: string;
  /** フォールバックアイコンのサイズ */
  iconSize?: number;
}

function UserAvatar({
  url,
  alt = 'User avatar',
  className,
  iconSize,
}: UserAvatarProps) {
  // classNameからサイズを推測してアイコンサイズを決定
  const defaultIconSize = iconSize ?? (className?.includes('w-12') ? 24 : className?.includes('w-16') ? 32 : className?.includes('w-20') ? 40 : 20);

  return (
    <Avatar alt={alt} className={className}>
      {url ? (
        <AvatarImage source={{ uri: url }} />
      ) : null}
      <AvatarFallback>
        <AvatarIcon size={defaultIconSize} />
      </AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarFallback, AvatarIcon, AvatarImage, UserAvatar };
