/**
 * 退会手続きページ
 *
 * 削除リクエストの作成
 * - リクエスト後は即座にサインアウト
 */

import React, { useState } from 'react';
import { View, Text, Alert, TextInput, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  PageHeader,
  Button,
  Text as ButtonText,
  buttonTextVariants,
} from '@/shared/ui';
import { colors, iconSizeNum } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import { createDeletionRequest } from '@/shared/api/supabase';
import { useSignOut } from '@/features/auth';

export function DeleteAccountPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { signOut } = useSignOut();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 削除リクエストを実行
  const handleDeletion = async () => {
    setIsSubmitting(true);
    try {
      log.info('[DeleteAccount] 削除リクエスト送信中...');
      const response = await createDeletionRequest(reason.trim() || undefined);
      log.info('[DeleteAccount] レスポンス:', JSON.stringify(response));

      if (response.success) {
        // signOut が失敗してもサインアウト処理を続行
        try {
          await signOut();
        } catch (signOutErr) {
          log.warn('[DeleteAccount] サインアウトエラー（続行）:', signOutErr);
        }
        router.replace('/auth/auth-required');
      } else {
        Alert.alert(t('common.error'), response.error ?? t('common.error'));
      }
    } catch (err) {
      log.error('[DeleteAccount] 例外:', err);
      const message = err instanceof Error ? err.message : t('common.error');
      Alert.alert(t('common.error'), message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 確認ダイアログを表示（React Native 標準の Alert を使用）
  const handlePressDelete = () => {
    Alert.alert(
      t('settings.deleteAccountPage.confirmTitle'),
      t('settings.deleteAccountPage.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.deleteAccountPage.confirm'),
          style: 'destructive',
          onPress: handleDeletion,
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('settings.deleteAccountPage.title')} />
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        extraScrollHeight={20}
      >
        {/* 警告アイコン */}
        <View className="items-center py-8">
          <View className="w-20 h-20 rounded-full bg-error-container justify-center items-center">
            <Ionicons name="warning" size={iconSizeNum['4xl']} color={themeColors.error} />
          </View>
        </View>

        <Text className="text-base text-on-surface text-center mb-6 leading-6">
          {t('settings.deleteAccountPage.description')}
        </Text>

        {/* 削除される内容 */}
        <View className="bg-secondary rounded-xl p-4 mb-6">
          <Text className="text-sm font-semibold text-on-surface mb-3">
            {t('settings.deleteAccountPage.whatWillBeDeleted')}
          </Text>
          {[
            t('settings.deleteAccountPage.item1'),
            t('settings.deleteAccountPage.item2'),
            t('settings.deleteAccountPage.item3'),
            t('settings.deleteAccountPage.item4'),
          ].map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Ionicons name="ellipse" size={6} color={themeColors['on-surface-variant']} style={{ marginRight: 8 }} />
              <Text className="flex-1 text-sm text-on-surface-variant">
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* 退会理由 */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-on-surface mb-2">
            {t('settings.deleteAccountPage.reasonLabel')}
          </Text>
          <TextInput
            className="bg-secondary rounded-xl p-4 text-base text-on-surface min-h-[100px]"
            placeholder={t('settings.deleteAccountPage.reasonPlaceholder')}
            placeholderTextColor={colors.light['on-surface-variant']}
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Button onPress={handlePressDelete} disabled={isSubmitting} variant="destructive">
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <ButtonText className={buttonTextVariants({ variant: 'destructive' })}>
              {t('settings.deleteAccountPage.confirm')}
            </ButtonText>
          )}
        </Button>

        <View className="h-8" />
      </KeyboardAwareScrollView>
    </View>
  );
}
