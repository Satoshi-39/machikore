/**
 * キャッシュクリアボタン
 *
 * 設定画面で使用するキャッシュクリア用のSettingsItem
 */

import React, { useCallback } from 'react';
import { Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useClearCache } from '../model/use-clear-cache';

export function ClearCacheButton() {
  const { t } = useI18n();
  const { clearCache, isClearing } = useClearCache();

  const handlePress = useCallback(() => {
    Alert.alert(
      t('settings.clearCacheConfirm'),
      t('settings.clearCacheDescription'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.ok'),
          onPress: async () => {
            await clearCache();
            Toast.show({
              type: 'success',
              text1: t('settings.clearCacheSuccess'),
            });
          },
        },
      ]
    );
  }, [t, clearCache]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={isClearing}
      className="flex-row items-center px-4 py-3.5 border-b-hairline border-outline-variant active:bg-secondary"
    >
      <Ionicons
        name="trash-outline"
        size={iconSizeNum.lg}
        className="text-on-surface-variant"
      />
      <Text className="flex-1 text-base ml-3 text-on-surface">
        {t('settings.clearCache')}
      </Text>
      {isClearing && (
        <ActivityIndicator size="small" className="text-primary" />
      )}
    </Pressable>
  );
}
