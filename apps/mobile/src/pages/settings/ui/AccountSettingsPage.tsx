/**
 * アカウント設定ページ
 *
 * メールアドレス表示、ユーザー名編集、退会手続き
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useCurrentUserId } from '@/entities/user';
import { useUser } from '@/entities/user/api';

// 設定アイテム
interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
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
      disabled={!onPress}
      className="flex-row items-center px-4 py-3.5 border-b-hairline border-outline-variant active:bg-secondary"
    >
      <Ionicons
        name={icon}
        size={iconSizeNum.lg}
        color={destructive ? colors.light.error : colors.light["on-surface-variant"]}
      />
      <Text
        className={`flex-1 text-base ml-3 ${destructive ? 'text-red-500' : 'text-on-surface'}`}
      >
        {label}
      </Text>
      {value && (
        <Text className="text-sm text-on-surface-variant mr-2">{value}</Text>
      )}
      {showArrow && (
        <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-on-surface-variant" />
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
    <View className="bg-surface">
      <Text className={`text-xs font-medium text-on-surface-variant uppercase px-4 pb-2 ${isFirst ? 'pt-4' : 'pt-6'}`}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export function AccountSettingsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: user } = useUser(currentUserId);

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('settings.accountSettings')} />
      <ScrollView className="flex-1">
        {/* アカウント情報 */}
        <SettingsSection title={t('settings.accountInfo')} isFirst>
          {/* メールアドレス（読み取り専用） */}
          <SettingsItem
            icon="mail-outline"
            label={t('settings.email')}
            value={user?.email || ''}
            showArrow={false}
          />

          {/* ユーザー名（タップで編集ページへ） */}
          <SettingsItem
            icon="person-outline"
            label={t('settings.username')}
            value={user?.username ? `@${user.username}` : ''}
            onPress={() => router.push('/settings/edit-username')}
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
