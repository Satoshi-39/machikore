/**
 * 許可の事前説明モーダル
 *
 * OSの許可ダイアログを表示する前に、
 * ユーザーに許可の必要性を説明するカスタムUI
 */

import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface PermissionPromptModalProps {
  /** モーダルを表示するか */
  visible: boolean;
  /** タイトルのi18nキー */
  titleKey: string;
  /** メッセージのi18nキー */
  messageKey: string;
  /** 許可ボタンのi18nキー */
  acceptButtonKey: string;
  /** あとでボタンのi18nキー */
  laterButtonKey: string;
  /** アイコン名 */
  iconName?: keyof typeof Ionicons.glyphMap;
  /** 許可ボタンが押された時 */
  onAccept: () => void;
  /** あとでボタンが押された時 */
  onLater: () => void;
}

export function PermissionPromptModal({
  visible,
  titleKey,
  messageKey,
  acceptButtonKey,
  laterButtonKey,
  iconName = 'notifications-outline',
  onAccept,
  onLater,
}: PermissionPromptModalProps) {
  const { t } = useI18n();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onLater}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-surface dark:bg-dark-surface rounded-2xl p-6 w-full max-w-sm">
          {/* アイコン */}
          <View className="items-center mb-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary.light }}
            >
              <Ionicons
                name={iconName}
                size={32}
                color={colors.primary.DEFAULT}
              />
            </View>
          </View>

          {/* タイトル */}
          <Text className="text-xl font-bold text-foreground dark:text-dark-foreground text-center mb-3">
            {t(titleKey)}
          </Text>

          {/* メッセージ */}
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary text-center mb-6 leading-6">
            {t(messageKey)}
          </Text>

          {/* ボタン */}
          <View className="gap-3">
            {/* 許可するボタン */}
            <Pressable
              onPress={onAccept}
              className="py-3 rounded-xl items-center"
              style={{ backgroundColor: colors.primary.DEFAULT }}
            >
              <Text className="text-base font-semibold text-white">
                {t(acceptButtonKey)}
              </Text>
            </Pressable>

            {/* あとでボタン */}
            <Pressable
              onPress={onLater}
              className="py-3 rounded-xl items-center bg-gray-100 dark:bg-gray-800"
            >
              <Text className="text-base font-medium text-foreground-secondary dark:text-dark-foreground-secondary">
                {t(laterButtonKey)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
