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
  variant?: 'icon-only' | 'with-label';
  /** アイコンサイズ */
  iconSize?: number;
}

export function ShareButton({
  type,
  id,
  variant = 'with-label',
  iconSize = 18,
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

  if (variant === 'icon-only') {
    return (
      <Pressable onPress={handlePress} hitSlop={8}>
        <Ionicons name="share-outline" size={iconSize} color={colors.text.secondary} />
      </Pressable>
    );
  }

  // with-label (default)
  return (
    <Pressable onPress={handlePress} className="items-center">
      <View className="flex-row items-center justify-center h-6">
        <Ionicons name="share-outline" size={iconSize} color={colors.text.secondary} />
      </View>
      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
        {t('common.share')}
      </Text>
    </Pressable>
  );
}
