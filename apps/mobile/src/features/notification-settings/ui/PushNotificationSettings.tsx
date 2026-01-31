/**
 * プッシュ通知設定
 *
 * プッシュ通知のマスター設定と各種通知タイプの設定
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '@/shared/lib/i18n';
import { Switch } from '@/shared/ui';
import type { NotificationSettings } from '@/shared/api/supabase/notifications';

interface PushNotificationSettingsProps {
  settings: NotificationSettings;
  onToggle: (key: 'push_enabled' | 'like_enabled' | 'comment_enabled' | 'follow_enabled' | 'system_enabled', value: boolean) => void;
}

// 設定セクションヘッダー
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

function SettingsSection({ title, description, children, isFirst = false }: SettingsSectionProps) {
  return (
    <View className="bg-surface">
      <View className={`px-4 pb-2 ${isFirst ? 'pt-4' : 'pt-6'}`}>
        <Text className="text-xs font-medium text-on-surface-variant uppercase">
          {title}
        </Text>
        {description && (
          <Text className="text-xs text-on-surface-variant mt-1">
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
      className={`flex-row items-center px-4 py-3.5 border-b-hairline border-outline-variant ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Ionicons name={icon} size={22} className="text-on-surface-variant" />
      <View className="flex-1 ml-3">
        <Text className="text-base text-on-surface">{label}</Text>
        {description && (
          <Text className="text-xs text-on-surface-variant mt-0.5">
            {description}
          </Text>
        )}
      </View>
      <Switch
        checked={value}
        onCheckedChange={onValueChange}
        disabled={disabled}
      />
    </View>
  );
}

export function PushNotificationSettings({ settings, onToggle }: PushNotificationSettingsProps) {
  const { t } = useI18n();
  const isPushDisabled = !settings.push_enabled;

  return (
    <>
      {/* プッシュ通知マスター設定 */}
      <SettingsSection
        title={t('notification.pushNotification')}
        isFirst
      >
        <SettingsToggle
          icon="notifications"
          label={t('notification.receivePushNotifications')}
          value={settings.push_enabled}
          onValueChange={(value) => onToggle('push_enabled', value)}
        />
      </SettingsSection>

      {/* プッシュ通知タイプ別設定 */}
      <SettingsSection
        title={t('notification.notificationTypes')}
        description={!settings.push_enabled ? t('notification.pushDisabledNotice') : undefined}
      >
        <SettingsToggle
          icon="heart"
          label={t('notification.likeNotification')}
          description={t('notification.likeNotificationDescription')}
          value={settings.like_enabled}
          onValueChange={(value) => onToggle('like_enabled', value)}
          disabled={isPushDisabled}
        />
        <SettingsToggle
          icon="chatbubble"
          label={t('notification.commentNotification')}
          description={t('notification.commentNotificationDescription')}
          value={settings.comment_enabled}
          onValueChange={(value) => onToggle('comment_enabled', value)}
          disabled={isPushDisabled}
        />
        <SettingsToggle
          icon="person-add"
          label={t('notification.followNotification')}
          description={t('notification.followNotificationDescription')}
          value={settings.follow_enabled}
          onValueChange={(value) => onToggle('follow_enabled', value)}
          disabled={isPushDisabled}
        />
        <SettingsToggle
          icon="megaphone"
          label={t('notification.systemNotification')}
          description={t('notification.systemNotificationDescription')}
          value={settings.system_enabled}
          onValueChange={(value) => onToggle('system_enabled', value)}
          disabled={isPushDisabled}
        />
      </SettingsSection>
    </>
  );
}
