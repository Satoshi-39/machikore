/**
 * アカウント設定ページ
 *
 * ソーシャル連携、退会手続きなど
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

// 設定アイテム
interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  showArrow?: boolean;
  destructive?: boolean;
}

function SettingsItem({
  icon,
  label,
  value,
  onPress,
  showArrow = true,
  destructive = false,
}: SettingsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3.5 border-b border-border-light dark:border-dark-border-light active:bg-muted dark:active:bg-dark-muted"
    >
      <Ionicons
        name={icon}
        size={22}
        color={destructive ? '#EF4444' : colors.text.secondary}
      />
      <Text
        className={`flex-1 text-base ml-3 ${destructive ? 'text-red-500' : 'text-foreground dark:text-dark-foreground'}`}
      >
        {label}
      </Text>
      {value && (
        <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted mr-2">{value}</Text>
      )}
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
      )}
    </Pressable>
  );
}

// セクションヘッダー
interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

function SettingsSection({ title, children, isFirst = false }: SettingsSectionProps) {
  return (
    <View className="bg-surface dark:bg-dark-surface">
      <Text className={`text-xs font-medium text-foreground-secondary dark:text-dark-foreground-secondary uppercase px-4 pb-2 ${isFirst ? 'pt-4' : 'pt-6'}`}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export function AccountSettingsPage() {
  const router = useRouter();
  const { t } = useI18n();

  const showComingSoon = () => {
    // TODO: 実装
  };

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title={t('settings.accountSettings')} />
      <ScrollView className="flex-1">
        {/* ソーシャル連携 */}
        <SettingsSection title={t('settings.socialConnections')} isFirst>
          <SettingsItem
            icon="logo-google"
            label="Google"
            value={t('settings.notConnected')}
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="logo-apple"
            label="Apple"
            value={t('settings.notConnected')}
            onPress={showComingSoon}
          />
        </SettingsSection>

        {/* 退会 */}
        <SettingsSection title={t('settings.accountManagement')}>
          <SettingsItem
            icon="trash-outline"
            label={t('settings.deleteAccountProcedure')}
            onPress={() => router.push('/settings/delete-account')}
            destructive
          />
        </SettingsSection>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
