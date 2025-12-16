/**
 * 設定ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSignOut } from '@/features/auth';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useAppSettingsStore } from '@/shared/lib/store';
import { useIsPremium } from '@/entities/subscription';

interface SettingsPageProps {
  onSignOutSuccess?: () => void;
}

// 設定セクションヘッダー
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

// 設定アイテム（タップで遷移）
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

// 設定アイテム（トグルスイッチ）
interface SettingsToggleProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

function SettingsToggle({
  icon,
  label,
  value,
  onValueChange,
  disabled = false,
}: SettingsToggleProps) {
  return (
    <View className="flex-row items-center px-4 py-3.5 border-b border-border-light dark:border-dark-border-light">
      <Ionicons name={icon} size={22} color={colors.text.secondary} />
      <Text className="flex-1 text-base text-foreground dark:text-dark-foreground ml-3">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.gray[300], true: colors.primary.DEFAULT }}
        thumbColor="white"
      />
    </View>
  );
}

export function SettingsPage({ onSignOutSuccess }: SettingsPageProps) {
  const router = useRouter();
  const { signOut } = useSignOut();
  const isPremium = useIsPremium();

  // ストアから設定値を取得
  const themeMode = useAppSettingsStore((state) => state.themeMode);
  const setThemeMode = useAppSettingsStore((state) => state.setThemeMode);

  const isDarkMode = themeMode === 'dark';
  const handleDarkModeChange = (value: boolean) => {
    setThemeMode(value ? 'dark' : 'light');
  };

  const handleSignOutPress = () => {
    Alert.alert(
      'サインアウト',
      'サインアウトしてもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'サインアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              onSignOutSuccess?.();
            } catch (error) {
              // エラーはuseSignOutで処理済み
            }
          },
        },
      ]
    );
  };

  const showComingSoon = () => {
    Alert.alert('準備中', 'この機能は準備中です。');
  };

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title="設定" />
      <ScrollView className="flex-1">
        {/* アカウント */}
        <SettingsSection title="アカウント" isFirst>
          <SettingsItem
            icon="person-outline"
            label="プロフィール編集"
            onPress={() => router.push('/edit-profile')}
          />
          <SettingsItem
            icon="mail-outline"
            label="メールアドレス変更"
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="lock-closed-outline"
            label="パスワード変更"
            onPress={showComingSoon}
          />
        </SettingsSection>

        {/* プレミアム */}
        <SettingsSection title="プレミアム">
          <SettingsItem
            icon="diamond-outline"
            label="プレミアムプラン"
            value={isPremium ? '加入中' : undefined}
            onPress={() => router.push('/settings/premium')}
          />
        </SettingsSection>

        {/* 表示 */}
        <SettingsSection title="表示">
          <SettingsToggle
            icon="moon-outline"
            label="ダークモード"
            value={isDarkMode}
            onValueChange={handleDarkModeChange}
          />
        </SettingsSection>

        {/* 通知 */}
        <SettingsSection title="通知">
          <SettingsItem
            icon="notifications-outline"
            label="通知設定"
            onPress={() => router.push('/settings/notifications')}
          />
        </SettingsSection>

        {/* プライバシー */}
        <SettingsSection title="プライバシー">
          <SettingsItem
            icon="eye-outline"
            label="公開範囲"
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="ban-outline"
            label="ブロックしたユーザー"
            onPress={showComingSoon}
          />
        </SettingsSection>

        {/* その他 */}
        <SettingsSection title="その他">
          <SettingsItem
            icon="help-circle-outline"
            label="ヘルプ"
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="document-text-outline"
            label="利用規約"
            onPress={() => router.push('/settings/terms')}
          />
          <SettingsItem
            icon="shield-outline"
            label="プライバシーポリシー"
            onPress={() => router.push('/settings/privacy')}
          />
          <SettingsItem
            icon="information-circle-outline"
            label="アプリについて"
            value="v1.0.0"
            onPress={showComingSoon}
          />
        </SettingsSection>

        {/* 危険なアクション */}
        <SettingsSection title="アカウント操作">
          <SettingsItem
            icon="log-out-outline"
            label="サインアウト"
            onPress={handleSignOutPress}
            showArrow={false}
            destructive
          />
          <SettingsItem
            icon="trash-outline"
            label="アカウント削除"
            onPress={showComingSoon}
            showArrow={false}
            destructive
          />
        </SettingsSection>

        {/* 下部余白 */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
