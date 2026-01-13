/**
 * 経路案内ボタン
 *
 * Google Maps / Apple Mapsで経路案内を開く
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

interface DirectionsButtonProps {
  latitude: number;
  longitude: number;
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

export function DirectionsButton({
  latitude,
  longitude,
  variant = 'with-label',
  iconSize = 18,
  label,
  iconColor,
  labelClassName,
}: DirectionsButtonProps) {
  const { t } = useI18n();

  const handlePress = useCallback(async () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}`;

    try {
      if (Platform.OS === 'ios') {
        const canOpenGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
        if (canOpenGoogleMaps) {
          await Linking.openURL(`comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=transit`);
        } else {
          await Linking.openURL(appleMapsUrl);
        }
      } else {
        await Linking.openURL(googleMapsUrl);
      }
    } catch (error) {
      log.error('[DirectionsButton] Error opening maps:', error);
      try {
        await Linking.openURL(googleMapsUrl);
      } catch (fallbackError) {
        log.error('[DirectionsButton] Fallback error:', fallbackError);
      }
    }
  }, [latitude, longitude]);

  const displayLabel = label ?? t('common.directions');

  if (variant === 'icon-only') {
    return (
      <Pressable onPress={handlePress} hitSlop={8}>
        <Ionicons name="navigate" size={iconSize} color={colors.text.secondary} />
      </Pressable>
    );
  }

  if (variant === 'circle') {
    return (
      <Pressable onPress={handlePress} className="flex-1 items-center py-2">
        <View className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-1">
          <Ionicons name="navigate" size={24} color={colors.text.secondary} />
        </View>
        <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
          {displayLabel}
        </Text>
      </Pressable>
    );
  }

  // inline（カルーセル等で使用）
  if (variant === 'inline') {
    return (
      <Pressable onPress={handlePress} className="flex-row items-center active:opacity-70">
        <Ionicons
          name="navigate-outline"
          size={iconSize}
          color={iconColor ?? colors.text.secondary}
        />
        <Text className={labelClassName ?? "text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1"}>
          {displayLabel}
        </Text>
      </Pressable>
    );
  }

  // with-label (default)
  return (
    <Pressable onPress={handlePress} className="items-center">
      <View className="flex-row items-center justify-center h-6">
        <Ionicons name="navigate" size={iconSize} color={colors.text.secondary} />
      </View>
      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
        {displayLabel}
      </Text>
    </Pressable>
  );
}
