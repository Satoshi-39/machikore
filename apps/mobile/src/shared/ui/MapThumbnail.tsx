/**
 * マップサムネイル画像コンポーネント
 *
 * サムネイルURLがある場合はその画像を表示
 * ない場合はデフォルトのマップアイコンを表示
 */

import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { getOptimizedImageUrl, getOptimalWidth } from '@/shared/lib/image';

/** マップのブランドカラー */
const MAP_BRAND_COLOR = '#1A8CFF';

interface MapThumbnailProps {
  /** サムネイルURL（nullの場合はデフォルトアイコン） */
  url: string | null | undefined;
  /** 幅 */
  width: number;
  /** 高さ */
  height: number;
  /** 角丸（デフォルト: 8） */
  borderRadius?: number;
  /** 追加のクラス名 */
  className?: string;
  /** 背景色（指定時はデフォルトの背景色を上書き） */
  backgroundColor?: string;
  /** デフォルトアイコン名（デフォルト: 'map'） */
  defaultIcon?: keyof typeof Ionicons.glyphMap;
  /** デフォルトアイコンサイズ（指定しない場合は幅の40%） */
  defaultIconSize?: number;
  /** デフォルトアイコンカラー（デフォルト: #1A8CFF） */
  defaultIconColor?: string;
  /** デフォルト画像時にボーダーを表示するか（背景と同色の場合に使用） */
  showBorderOnDefault?: boolean;
}

export function MapThumbnail({
  url,
  width,
  height,
  borderRadius = 8,
  className = '',
  backgroundColor,
  defaultIcon = 'map',
  defaultIconSize,
  defaultIconColor = MAP_BRAND_COLOR,
  showBorderOnDefault = false,
}: MapThumbnailProps) {
  const isDarkMode = useIsDarkMode();

  // 表示サイズに応じた最適化URLを生成（width, height両方指定でresize=cover適用）
  const optimizedUrl = getOptimizedImageUrl(url, {
    width: getOptimalWidth(width),
    height: getOptimalWidth(height),
    quality: 75,
  });

  // 背景色の決定: 指定があればそれを使用、なければダークモード対応のデフォルト
  const bgColor = backgroundColor ?? (isDarkMode ? colors.dark.secondary : colors.light.secondary);

  // アイコンサイズ（指定がなければ幅の40%、最小24px、最大96px）
  const iconSize = defaultIconSize ?? Math.max(24, Math.min(96, Math.floor(Math.min(width, height) * 0.4)));

  // アイコンカラー（propsで指定された色を使用）
  const iconColor = defaultIconColor;

  if (optimizedUrl) {
    return (
      <View
        className={`overflow-hidden ${className}`}
        style={{
          width,
          height,
          borderRadius,
          backgroundColor: bgColor,
        }}
      >
        <Image
          source={{ uri: optimizedUrl }}
          style={{
            width,
            height,
          }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      </View>
    );
  }

  // 画像がない場合はアイコンを表示
  return (
    <View
      className={`overflow-hidden items-center justify-center ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: bgColor,
        // showBorderOnDefaultがtrueの場合のみボーダーを表示（背景と同色の場合に使用）
        borderWidth: showBorderOnDefault ? 1 : 0,
        borderColor: showBorderOnDefault
          ? (isDarkMode ? colors.gray[600] : colors.gray[300])
          : 'transparent',
      }}
    >
      <Ionicons name={defaultIcon} size={iconSize} color={iconColor} />
    </View>
  );
}
