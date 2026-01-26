/**
 * 通知許可プロンプト
 *
 * iOSで通知が許可されていない場合に表示するUI
 * 設定アプリを開くボタンを提供
 */

import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

export function NotificationPermissionPrompt() {
  const { t } = useI18n();

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <View className="flex-1 px-4 py-8">
      <View className="bg-surface rounded-2xl p-6 items-center">
        {/* アイコン */}
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: `${colors.light.primary}20` }}
        >
          <Ionicons
            name="notifications-outline"
            size={iconSizeNum.xl}
            className="text-primary"
          />
        </View>

        {/* タイトル */}
        <Text className="text-lg font-bold text-on-surface text-center mb-2">
          {t('notification.permissionRequired')}
        </Text>

        {/* 説明 */}
        <Text className="text-sm text-on-surface-variant text-center mb-6 leading-5">
          {t('notification.permissionRequiredDescription')}
        </Text>

        {/* 設定を開くボタン */}
        <Pressable
          onPress={handleOpenSettings}
          className="w-full py-3 rounded-xl items-center bg-primary"
        >
          <Text className="text-base font-semibold text-white">
            {t('notification.openSettings')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
