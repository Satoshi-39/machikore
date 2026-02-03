/**
 * Avatarコンポーネント
 *
 * react-native-reusablesパターンに基づいたアバターUI
 * @rn-primitives/avatarを使用
 */

import * as AvatarPrimitive from '@rn-primitives/avatar';
import * as React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { getOptimizedImageUrl, IMAGE_PRESETS, type ThumbnailCrop } from '@/shared/lib/image';

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
      'flex h-full w-full items-center justify-center rounded-full bg-secondary-container',
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

function AvatarIcon({ size = 20, color = colors.primitive.gray[500] }: AvatarIconProps) {
  return <Ionicons name="person" size={size} color={color} />;
}

/**
 * ユーザーアバターの便利コンポーネント
 * URLがあれば画像、なければデフォルトアイコンを表示
 */
interface UserAvatarProps {
  /** アバター画像URL */
  url?: string | null;
  /** クロップ座標（指定時はクロップ表示） */
  crop?: ThumbnailCrop | null;
  /** 代替テキスト */
  alt?: string;
  /** サイズクラス（w-10 h-10 など） */
  className?: string;
  /** コンテナサイズ（px）。crop指定時に必要 */
  size?: number;
  /** フォールバックアイコンのサイズ */
  iconSize?: number;
}

function UserAvatar({
  url,
  crop,
  alt: _alt = 'User avatar',
  className,
  size,
  iconSize,
}: UserAvatarProps) {
  // classNameからサイズを推測してアイコンサイズを決定
  const defaultIconSize = iconSize ?? (className?.includes('w-12') ? 24 : className?.includes('w-16') ? 32 : className?.includes('w-20') ? 40 : 20);

  // 表示サイズに応じた最適化プリセットを選択
  const isLarge = className?.includes('w-16') || className?.includes('w-20') || className?.includes('w-24');
  const preset = isLarge ? IMAGE_PRESETS.avatarLarge : IMAGE_PRESETS.avatar;
  const optimizedUrl = getOptimizedImageUrl(url, preset);

  // crop指定時: CroppedThumbnailと同じロジックで丸くクロップ表示
  if (optimizedUrl && crop && size) {
    const containerSize = size;
    const scale = containerSize / crop.width;
    const imageDisplayWidth = crop.imageWidth * scale;
    const imageDisplayHeight = crop.imageHeight * scale;

    return (
      <View
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: optimizedUrl }}
          style={{
            position: 'absolute',
            width: imageDisplayWidth,
            height: imageDisplayHeight,
            left: -crop.originX * scale,
            top: -crop.originY * scale,
          }}
          cachePolicy="memory-disk"
        />
      </View>
    );
  }

  // expo-imageを直接使用（@rn-primitives/avatarのImageは最適化URLと相性が悪い）
  return (
    <View className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)}>
      {optimizedUrl ? (
        <Image
          source={{ uri: optimizedUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      ) : (
        <View className="flex h-full w-full items-center justify-center rounded-full bg-secondary-container">
          <AvatarIcon size={defaultIconSize} />
        </View>
      )}
    </View>
  );
}

export { Avatar, AvatarFallback, AvatarIcon, AvatarImage, UserAvatar };
