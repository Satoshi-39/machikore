/**
 * 共有ボタン
 *
 * スポットやマップを共有する機能を提供
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, SHARE_URLS } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

interface ShareButtonProps {
  /** 共有対象のタイプ */
  type: 'spot' | 'map';
  /** 共有対象のID */
  id: string;
  /** ボタンのバリアント */
  variant?: 'icon-only' | 'with-label' | 'inline';
  /** アイコンサイズ */
  iconSize?: number;
  /** アイコンの色（inline用） */
  iconColor?: string;
  /** ラベルのクラス名（inline用） */
  labelClassName?: string;
}

export function ShareButton({
  type,
  id,
  variant = 'with-label',
  iconSize = 18,
  iconColor,
  labelClassName,
}: ShareButtonProps) {
  const { t } = useI18n();

  const handlePress = useCallback(async () => {
    try {
      const url = type === 'spot' ? SHARE_URLS.spot(id) : SHARE_URLS.map(id);
      await Share.share(
        Platform.select({
          ios: { url },
          default: { message: url },
        })!
      );
    } catch (error) {
      log.error('[ShareButton] Share error:', error);
    }
  }, [type, id]);

  const finalIconColor = iconColor ?? colors.text.secondary;

  if (variant === 'icon-only') {
    return (
      <Pressable onPress={handlePress} hitSlop={8}>
        <Ionicons name="share-outline" size={iconSize} color={finalIconColor} />
      </Pressable>
    );
  }

  // inline（カルーセル等で横並び配置）
  if (variant === 'inline') {
    return (
      <Pressable onPress={handlePress} className="flex-row items-center active:opacity-70">
        <Ionicons name="share-outline" size={iconSize} color={finalIconColor} />
        <Text className={labelClassName ?? "text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1"}>
          {t('common.share')}
        </Text>
      </Pressable>
    );
  }

  // with-label (default)
  return (
    <Pressable onPress={handlePress} className="items-center">
      <View className="flex-row items-center justify-center h-6">
        <Ionicons name="share-outline" size={iconSize} color={finalIconColor} />
      </View>
      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
        {t('common.share')}
      </Text>
    </Pressable>
  );
}
