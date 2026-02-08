/**
 * 設定ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import { useIsPremium } from '@/entities/subscription';
import { useSignOut } from '@/features/auth';
import { ClearCacheButton } from '@/features/clear-cache';
import { colors, EXTERNAL_LINKS, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useAppSettingsStore, useTutorialStore } from '@/shared/lib/store';
import { PageHeader } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

interface SettingsPageProps {
  onSignOutSuccess?: () => void;
}

// 設定セクションヘッダー
interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

function SettingsSection({
  title,
  children,
  isFirst = false,
}: SettingsSectionProps) {
  return (
    <View
      className={`bg-surface ${isFirst ? '' : 'border-t-hairline border-outline-variant'}`}
    >
      <Text
        className={`text-xs font-medium text-on-surface-variant uppercase px-4 pb-2 ${isFirst ? 'pt-4' : 'pt-6'}`}
      >
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
      className="flex-row items-center px-4 py-3.5 active:bg-secondary"
    >
      <Ionicons
        name={icon}
        size={iconSizeNum.lg}
        color={
          destructive ? colors.light.error : colors.light['on-surface-variant']
        }
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
        <Ionicons
          name="chevron-forward"
          size={iconSizeNum.md}
          className="text-on-surface-variant"
        />
      )}
    </Pressable>
  );
}

export function SettingsPage({ onSignOutSuccess }: SettingsPageProps) {
  const router = useRouter();
  const { signOut } = useSignOut();
  const isPremium = useIsPremium();
  const { t } = useI18n();
  const resetSettings = useAppSettingsStore((state) => state.resetSettings);

  // 開発用: オンボーディング（利用規約同意）をリセット
  const handleResetOnboarding = () => {
    Alert.alert(
      t('settings.resetOnboarding'),
      t('settings.resetOnboardingDescription'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.reset'),
          style: 'destructive',
          onPress: async () => {
            resetSettings();
            await signOut();
            Alert.alert(t('settings.resetComplete'), t('settings.resetCompleteMessage'));
          },
        },
      ]
    );
  };

  const handleSignOutPress = () => {
    Alert.alert(t('settings.signOut'), t('settings.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.signOut'),
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
    ]);
  };

  const showComingSoon = () => {
    Alert.alert(t('settings.comingSoon'), t('settings.comingSoonMessage'));
  };

  // チュートリアル再表示
  const handleRestartTutorial = () => {
    useTutorialStore.getState().resetTutorial();
    // ホームタブに戻ってからチュートリアルを開始
    router.navigate('/(tabs)/home');
    setTimeout(() => {
      useTutorialStore.getState().requestStartTutorial();
    }, 300);
  };

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('settings.settings')} />
      <ScrollView className="flex-1">
        {/* アカウント */}
        <SettingsSection title={t('settings.account')} isFirst>
          <SettingsItem
            icon="person-outline"
            label={t('settings.editProfile')}
            onPress={() => router.push('/edit-profile?mode=full')}
          />
          {/* メールアドレス変更・パスワード変更 - マジックリンク/OAuth認証のため不要、将来対応時に有効化 */}
          {/* <SettingsItem
            icon="mail-outline"
            label={t('settings.changeEmail')}
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="lock-closed-outline"
            label={t('settings.changePassword')}
            onPress={showComingSoon}
          /> */}
        </SettingsSection>

        {/* プレミアム */}
        <SettingsSection title={t('settings.premium')}>
          <SettingsItem
            icon="medal-outline"
            label={t('settings.premiumPlan')}
            value={isPremium ? t('settings.subscribed') : undefined}
            onPress={() => router.push('/premium')}
          />
        </SettingsSection>

        {/* 表示 */}
        <SettingsSection title={t('settings.settings')}>
          <SettingsItem
            icon="language-outline"
            label={t('settings.language')}
            onPress={() => router.push('/settings/language')}
          />
          <SettingsItem
            icon="color-palette-outline"
            label={t('settings.appearance')}
            onPress={() => router.push('/settings/appearance')}
          />
        </SettingsSection>

        {/* 通知 */}
        <SettingsSection title={t('settings.notifications')}>
          <SettingsItem
            icon="notifications-outline"
            label={t('settings.notificationSettings')}
            onPress={() => router.push('/settings/notifications')}
          />
        </SettingsSection>

        {/* プライバシー */}
        <SettingsSection title={t('settings.privacy')}>
          {/* 公開範囲 - 機能実装後に有効化 */}
          {/* <SettingsItem
            icon="earth"
            label={t('settings.publicScope')}
            onPress={showComingSoon}
          /> */}
          <SettingsItem
            icon="ban-outline"
            label={t('settings.blockedUsers')}
            onPress={() => router.push('/settings/blocked-users')}
          />
        </SettingsSection>

        {/* 法的情報 */}
        <SettingsSection title={t('settings.legal')}>
          <SettingsItem
            icon="document-text-outline"
            label={t('settings.termsOfService')}
            onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.TERMS)}
          />
          <SettingsItem
            icon="shield-outline"
            label={t('settings.privacyPolicy')}
            onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.PRIVACY)}
          />
          {/* オープンソースライセンス - Settings.bundle修正後に有効化 */}
          {/* <SettingsItem
            icon="code-slash-outline"
            label={t('settings.openSourceLicenses')}
            onPress={() => ReactNativeLegal.launchLicenseListScreen(t('settings.openSourceLicenses'))}
          /> */}
          <SettingsItem
            icon="layers-outline"
            label={t('settings.dataSources')}
            onPress={() => router.push('/settings/attributions')}
          />
        </SettingsSection>

        {/* その他 */}
        <SettingsSection title={t('settings.other')}>
          <SettingsItem
            icon="book-outline"
            label={t('tutorial.usageGuide')}
            onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.GUIDE)}
          />
          <SettingsItem
            icon="refresh-circle-outline"
            label={t('tutorial.restartTutorial')}
            onPress={handleRestartTutorial}
            showArrow={false}
          />
          <SettingsItem
            icon="chatbubble-ellipses-outline"
            label={t('settings.support')}
            onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.SUPPORT)}
          />
          {/* ヘルプ - ヘルプページ準備後に有効化 */}
          {/* <SettingsItem
            icon="help-circle-outline"
            label={t('settings.help')}
            onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.HELP)}
          /> */}
          {/* アプリについて - 準備後に有効化 */}
          {/* <SettingsItem
            icon="information-circle-outline"
            label={t('settings.about')}
            value="v1.0.0"
            onPress={showComingSoon}
          /> */}
          <ClearCacheButton />
        </SettingsSection>

        {/* アカウント操作 */}
        <SettingsSection title={t('settings.accountActions')}>
          <SettingsItem
            icon="settings-outline"
            label={t('settings.accountSettings')}
            onPress={() => router.push('/settings/account')}
          />
          <SettingsItem
            icon="log-out-outline"
            label={t('settings.signOut')}
            onPress={handleSignOutPress}
            showArrow={false}
          />
        </SettingsSection>

        {/* 開発者メニュー（開発モードのみ） */}
        {__DEV__ && (
          <SettingsSection title={t('settings.devMenu')}>
            <SettingsItem
              icon="refresh-outline"
              label={t('settings.resetOnboarding')}
              onPress={handleResetOnboarding}
              showArrow={false}
            />
          </SettingsSection>
        )}

        {/* 下部余白 */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
