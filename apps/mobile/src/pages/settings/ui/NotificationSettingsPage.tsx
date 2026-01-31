/**
 * 通知設定ページ
 *
 * プッシュ通知・メール通知の詳細設定を管理
 * iOSの通知許可状態をチェックし、許可されていない場合は
 * 設定を開くUIを表示する
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, AppState } from 'react-native';
import { PageHeader, ErrorView } from '@/shared/ui';
import { useNotificationSettings, useUpdateNotificationSettings } from '@/entities/user';
import { useI18n } from '@/shared/lib/i18n';
import { getNotificationPermissionStatus, requestNotificationPermissions, getExpoPushToken } from '@/shared/lib/notifications';
import { updatePushToken } from '@/shared/api/supabase/users';
import {
  NotificationPermissionPrompt,
  PushNotificationSettings,
  EmailNotificationSettings,
} from '@/features/notification-settings';

// タブの種類
type TabType = 'push' | 'email';

// タブコンポーネント
interface TabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pushLabel: string;
  emailLabel: string;
}

function NotificationTabs({ activeTab, onTabChange, pushLabel, emailLabel }: TabProps) {
  return (
    <View className="flex-row bg-surface border-b-hairline border-outline-variant">
      <Pressable
        onPress={() => onTabChange('push')}
        className={`flex-1 py-3 items-center border-b-medium ${
          activeTab === 'push' ? 'border-primary' : 'border-transparent'
        }`}
      >
        <Text
          className={`font-medium ${
            activeTab === 'push'
              ? 'text-primary'
              : 'text-on-surface-variant'
          }`}
        >
          {pushLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onTabChange('email')}
        className={`flex-1 py-3 items-center border-b-medium ${
          activeTab === 'email' ? 'border-primary' : 'border-transparent'
        }`}
      >
        <Text
          className={`font-medium ${
            activeTab === 'email'
              ? 'text-primary'
              : 'text-on-surface-variant'
          }`}
        >
          {emailLabel}
        </Text>
      </Pressable>
    </View>
  );
}

export function NotificationSettingsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>('push');
  const [osPermissionStatus, setOsPermissionStatus] = useState<'granted' | 'denied' | 'undetermined' | null>(null);
  const { data: settings, isLoading, error } = useNotificationSettings();
  const { mutate: updateSettings } = useUpdateNotificationSettings();

  // OSの通知許可状態を取得
  const checkPermissionStatus = useCallback(async () => {
    const status = await getNotificationPermissionStatus();
    setOsPermissionStatus(status);
    return status;
  }, []);

  // undetermined の場合、iOSネイティブダイアログを表示
  const requestPermissionIfUndetermined = useCallback(async () => {
    const status = await checkPermissionStatus();
    if (status === 'undetermined') {
      const granted = await requestNotificationPermissions();
      if (granted) {
        const token = await getExpoPushToken();
        if (token) {
          await updatePushToken(token);
        }
      }
      // ダイアログ後に状態を再チェック
      await checkPermissionStatus();
    }
  }, [checkPermissionStatus]);

  // 初回ロード時にダイアログ表示、アプリがフォアグラウンドに戻った時に許可状態をチェック
  useEffect(() => {
    requestPermissionIfUndetermined();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkPermissionStatus();
      }
    });

    return () => subscription.remove();
  }, [checkPermissionStatus, requestPermissionIfUndetermined]);

  // 設定更新ハンドラー
  type PushSettingsKey = 'push_enabled' | 'like_enabled' | 'comment_enabled' | 'follow_enabled' | 'system_enabled';
  type EmailSettingsKey = 'email_enabled' | 'email_like_enabled' | 'email_comment_enabled' | 'email_follow_enabled' | 'email_system_enabled';

  const handlePushToggle = (key: PushSettingsKey, value: boolean) => {
    if (!settings) return;
    updateSettings({ [key]: value });
  };

  const handleEmailToggle = (key: EmailSettingsKey, value: boolean) => {
    if (!settings) return;
    updateSettings({ [key]: value });
  };

  // ローディング
  if (isLoading || osPermissionStatus === null) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('notification.notificationSettings')} showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  // エラー
  if (error || !settings) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('notification.notificationSettings')} showBackButton />
        <ErrorView variant="fullscreen" />
      </View>
    );
  }

  // OSで通知が許可されていない場合
  const isOsPermissionGranted = osPermissionStatus === 'granted';

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('notification.notificationSettings')} showBackButton />

      {/* タブ */}
      <NotificationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pushLabel={t('notification.pushNotification')}
        emailLabel={t('notification.emailNotification')}
      />

      <ScrollView className="flex-1">
        {activeTab === 'push' ? (
          isOsPermissionGranted ? (
            <PushNotificationSettings
              settings={settings}
              onToggle={handlePushToggle}
            />
          ) : (
            <NotificationPermissionPrompt />
          )
        ) : (
          <EmailNotificationSettings
            settings={settings}
            onToggle={handleEmailToggle}
          />
        )}

        {/* 下部余白 */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
