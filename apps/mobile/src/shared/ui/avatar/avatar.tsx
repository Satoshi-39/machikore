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
import { getOptimizedImageUrl, getOptimalWidth, IMAGE_PRESETS, type ThumbnailCrop } from '@/shared/lib/image';

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

  // 画像URL最適化
  // width+heightを指定してサーバー側で正方形にセンタークロップさせる
  // crop指定時は元URLを使うため、この最適化URLはcrop未指定時のみ使用
  const isLarge = className?.includes('w-16') || className?.includes('w-20') || className?.includes('w-24');
  const displaySize = isLarge ? IMAGE_PRESETS.avatarLarge.width : IMAGE_PRESETS.avatar.width;
  const optimizedUrl = getOptimizedImageUrl(url, { width: displaySize, height: displaySize, quality: 80 });

  // crop指定時: CroppedThumbnail/MapThumbnailと同じ方式で丸くクロップ表示
  // サーバーには元画像をアスペクト比維持で縮小させ、cropはクライアント側で実行
  if (url && crop && size) {
    const containerSize = size;
    const scale = containerSize / crop.width;
    const imageDisplayWidth = crop.imageWidth * scale;
    const imageDisplayHeight = crop.imageHeight * scale;

    // 画像最適化: width+height両方指定が必須（widthのみだとSupabaseは高さをリサイズしない）
    const optimalWidth = Math.min(getOptimalWidth(imageDisplayWidth), crop.imageWidth);
    const optimalHeight = Math.round(optimalWidth * crop.imageHeight / crop.imageWidth);
    const cropOptimizedUrl = getOptimizedImageUrl(url, { width: optimalWidth, height: optimalHeight, quality: 80 });

    return (
      <View
        className={className}
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: cropOptimizedUrl ?? url }}
          style={{
            position: 'absolute',
            width: imageDisplayWidth,
            height: imageDisplayHeight,
            left: -crop.originX * scale,
            top: -crop.originY * scale,
          }}
          cachePolicy="disk"
        />
      </View>
    );
  }

  // crop未指定: contentFit="cover"でクライアント側クロップ
  return (
    <View className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)}>
      {optimizedUrl ? (
        <Image
          source={{ uri: optimizedUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
          cachePolicy="disk"
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
