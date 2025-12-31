/**
 * 退会手続きページ
 *
 * 削除リクエストの作成
 * - リクエスト後は即座にサインアウト
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { PageHeader, Button } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { createDeletionRequest } from '@/shared/api/supabase';
import { useSignOut } from '@/features/auth';

export function DeleteAccountPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { signOut } = useSignOut();

  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 削除リクエストを作成
  const handleRequestDeletion = () => {
    Alert.alert(
      t('settings.deleteAccountPage.confirmTitle'),
      t('settings.deleteAccountPage.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.deleteAccountPage.confirm'),
          style: 'destructive',
          onPress: async () => {
            setIsSubmitting(true);
            try {
              const response = await createDeletionRequest(reason.trim() || undefined);
              if (response.success) {
                // 即座にサインアウト
                await signOut();
                // 認証ページに遷移
                router.replace('/auth/auth-required');
              } else {
                Alert.alert(t('common.error'), response.error ?? t('common.error'));
                setIsSubmitting(false);
              }
            } catch (err) {
              Alert.alert(t('common.error'), t('common.error'));
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title={t('settings.deleteAccountPage.title')} />
      <ScrollView className="flex-1 px-4">
        {/* 警告アイコン */}
        <View className="items-center py-8">
          <View className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 justify-center items-center">
            <Ionicons name="warning" size={48} color="#EF4444" />
          </View>
        </View>

        <Text className="text-base text-foreground dark:text-dark-foreground text-center mb-6 leading-6">
          {t('settings.deleteAccountPage.description')}
        </Text>

        {/* 削除される内容 */}
        <View className="bg-muted dark:bg-dark-muted rounded-xl p-4 mb-6">
          <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-3">
            {t('settings.deleteAccountPage.whatWillBeDeleted')}
          </Text>
          {[
            t('settings.deleteAccountPage.item1'),
            t('settings.deleteAccountPage.item2'),
            t('settings.deleteAccountPage.item3'),
            t('settings.deleteAccountPage.item4'),
          ].map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Ionicons name="ellipse" size={6} color="#9CA3AF" style={{ marginRight: 8 }} />
              <Text className="flex-1 text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* 退会理由 */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('settings.deleteAccountPage.reasonLabel')}
          </Text>
          <TextInput
            className="bg-muted dark:bg-dark-muted rounded-xl p-4 text-base text-foreground dark:text-dark-foreground min-h-[100px]"
            placeholder={t('settings.deleteAccountPage.reasonPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Button
          title={t('settings.deleteAccountPage.confirm')}
          onPress={handleRequestDeletion}
          loading={isSubmitting}
          variant="destructive"
        />

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
