/**
 * 外部マップボタン
 *
 * Google Mapsで場所の詳細を表示する
 * Place IDがある場合はGoogle Mapsの場所ページを直接開く
 * ない場合は緯度経度で検索
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

interface ExternalMapButtonProps {
  latitude: number;
  longitude: number;
  /** Google Place ID（あればGoogle Mapsの場所ページを直接開く） */
  googlePlaceId?: string | null;
  /** ボタンのバリアント */
  variant?: 'icon-only' | 'with-label' | 'circle' | 'inline';
  /** アイコンサイズ */
  iconSize?: number;
  /** ラベルを表示するか */
  label?: string;
  /** アイコンの色（inline用） */
  iconColor?: string;
  /** ラベルのクラス名（inline用） */
  labelClassName?: string;
}

export function ExternalMapButton({
  latitude,
  longitude,
  googlePlaceId,
  variant = 'with-label',
  iconSize = 18,
  label,
  iconColor,
  labelClassName,
}: ExternalMapButtonProps) {
  const { t } = useI18n();

  const handlePress = useCallback(async () => {
    // Place IDがある場合はGoogle Mapsの場所ページを直接開く
    // query_place_idで場所を特定し、queryはフォールバック用
    const url = googlePlaceId
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${googlePlaceId}`
      : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      log.error('[ExternalMapButton] Error opening Google Maps:', error);
    }
  }, [latitude, longitude, googlePlaceId]);

  const displayLabel = label ?? t('common.details');

  if (variant === 'icon-only') {
    return (
      <Pressable onPress={handlePress} hitSlop={8}>
        <Ionicons name="information-circle-outline" size={iconSize} className="text-on-surface-variant" />
      </Pressable>
    );
  }

  if (variant === 'circle') {
    return (
      <Pressable onPress={handlePress} className="flex-1 items-center py-2">
        <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center mb-1">
          <Ionicons name="information-circle-outline" size={iconSizeNum.lg} className="text-on-surface-variant" />
        </View>
        <Text className="text-xs text-on-surface-variant">{displayLabel}</Text>
      </Pressable>
    );
  }

  if (variant === 'inline') {
    return (
      <Pressable onPress={handlePress} className="flex-row items-center active:opacity-70">
        <Ionicons
          name="information-circle-outline"
          size={iconSize}
          color={iconColor ?? colors.light["on-surface-variant"]}
        />
        <Text className={labelClassName ?? "text-xs text-on-surface-variant ml-1"}>
          {displayLabel}
        </Text>
      </Pressable>
    );
  }

  // with-label (default)
  return (
    <Pressable onPress={handlePress} className="items-center">
      <View className="flex-row items-center justify-center h-6">
        <Ionicons name="information-circle-outline" size={iconSize} className="text-on-surface-variant" />
      </View>
      <Text className="text-xs text-on-surface-variant">{displayLabel}</Text>
    </Pressable>
  );
}
