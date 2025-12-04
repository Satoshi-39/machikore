/**
 * 通知設定ページ
 *
 * プッシュ通知・メール通知の詳細設定を管理
 */

import React from 'react';
import { View, Text, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useNotificationSettings, useUpdateNotificationSettings } from '@/entities/user';

// 設定セクションヘッダー
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

function SettingsSection({ title, description, children, isFirst = false }: SettingsSectionProps) {
  return (
    <View className="bg-surface dark:bg-dark-surface">
      <View className={`px-4 pb-2 ${isFirst ? 'pt-4' : 'pt-6'}`}>
        <Text className="text-xs font-medium text-foreground-secondary dark:text-dark-foreground-secondary uppercase">
          {title}
        </Text>
        {description && (
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1">
            {description}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}

// 設定トグルアイテム
interface SettingsToggleProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

function SettingsToggle({
  icon,
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}: SettingsToggleProps) {
  return (
    <View
      className={`flex-row items-center px-4 py-3.5 border-b border-border-light dark:border-dark-border-light ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Ionicons name={icon} size={22} color={colors.text.secondary} />
      <View className="flex-1 ml-3">
        <Text className="text-base text-foreground dark:text-dark-foreground">{label}</Text>
        {description && (
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-0.5">
            {description}
          </Text>
        )}
      </View>
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

export function NotificationSettingsPage() {
  const { data: settings, isLoading, error } = useNotificationSettings();
  const { mutate: updateSettings, isPending } = useUpdateNotificationSettings();

  // プッシュ通知設定のキー
  type PushSettingsKey = 'push_enabled' | 'like_enabled' | 'comment_enabled' | 'follow_enabled' | 'system_enabled';
  // メール通知設定のキー
  type EmailSettingsKey = 'email_enabled' | 'email_like_enabled' | 'email_comment_enabled' | 'email_follow_enabled' | 'email_system_enabled';

  // 設定更新ハンドラー
  const handleToggle = (key: PushSettingsKey | EmailSettingsKey, value: boolean) => {
    if (!settings) return;
    updateSettings({ [key]: value });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title="通知設定" showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  if (error || !settings) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title="通知設定" showBackButton />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={48} color={colors.text.secondary} />
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4 text-center">
            設定の読み込みに失敗しました
          </Text>
        </View>
      </View>
    );
  }

  const isPushDisabled = !settings.push_enabled || isPending;
  const isEmailDisabled = !settings.email_enabled || isPending;

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title="通知設定" showBackButton />
      <ScrollView className="flex-1">
        {/* マスター設定 */}
        <SettingsSection
          title="プッシュ通知"
          description="オフにすると全ての通知が届かなくなります"
          isFirst
        >
          <SettingsToggle
            icon="notifications"
            label="プッシュ通知を受け取る"
            value={settings.push_enabled}
            onValueChange={(value) => handleToggle('push_enabled', value)}
            disabled={isPending}
          />
        </SettingsSection>

        {/* プッシュ通知タイプ別設定 */}
        <SettingsSection
          title="プッシュ通知の種類"
          description={!settings.push_enabled ? 'プッシュ通知がオフのため変更できません' : undefined}
        >
          <SettingsToggle
            icon="heart"
            label="いいね"
            description="あなたの投稿にいいねされた時"
            value={settings.like_enabled}
            onValueChange={(value) => handleToggle('like_enabled', value)}
            disabled={isPushDisabled}
          />
          <SettingsToggle
            icon="chatbubble"
            label="コメント"
            description="あなたの投稿にコメントされた時"
            value={settings.comment_enabled}
            onValueChange={(value) => handleToggle('comment_enabled', value)}
            disabled={isPushDisabled}
          />
          <SettingsToggle
            icon="person-add"
            label="フォロー"
            description="新しいフォロワーができた時"
            value={settings.follow_enabled}
            onValueChange={(value) => handleToggle('follow_enabled', value)}
            disabled={isPushDisabled}
          />
          <SettingsToggle
            icon="megaphone"
            label="お知らせ"
            description="運営からのお知らせ"
            value={settings.system_enabled}
            onValueChange={(value) => handleToggle('system_enabled', value)}
            disabled={isPushDisabled}
          />
        </SettingsSection>

        {/* メール通知マスター設定 */}
        <SettingsSection
          title="メール通知"
          description="オフにすると全てのメール通知が届かなくなります"
        >
          <SettingsToggle
            icon="mail"
            label="メール通知を受け取る"
            value={settings.email_enabled}
            onValueChange={(value) => handleToggle('email_enabled', value)}
            disabled={isPending}
          />
        </SettingsSection>

        {/* メール通知タイプ別設定 */}
        <SettingsSection
          title="メール通知の種類"
          description={!settings.email_enabled ? 'メール通知がオフのため変更できません' : undefined}
        >
          <SettingsToggle
            icon="heart"
            label="いいね"
            description="あなたの投稿にいいねされた時"
            value={settings.email_like_enabled}
            onValueChange={(value) => handleToggle('email_like_enabled', value)}
            disabled={isEmailDisabled}
          />
          <SettingsToggle
            icon="chatbubble"
            label="コメント"
            description="あなたの投稿にコメントされた時"
            value={settings.email_comment_enabled}
            onValueChange={(value) => handleToggle('email_comment_enabled', value)}
            disabled={isEmailDisabled}
          />
          <SettingsToggle
            icon="person-add"
            label="フォロー"
            description="新しいフォロワーができた時"
            value={settings.email_follow_enabled}
            onValueChange={(value) => handleToggle('email_follow_enabled', value)}
            disabled={isEmailDisabled}
          />
          <SettingsToggle
            icon="megaphone"
            label="お知らせ"
            description="運営からのお知らせ"
            value={settings.email_system_enabled}
            onValueChange={(value) => handleToggle('email_system_enabled', value)}
            disabled={isEmailDisabled}
          />
        </SettingsSection>

        {/* 下部余白 */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
