/**
 * 退会手続きページ
 *
 * 削除リクエストの作成
 * - リクエスト後は即座にサインアウト
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  PageHeader,
  Button,
  Text as ButtonText,
  buttonTextVariants,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { createDeletionRequest } from '@/shared/api/supabase';
import { useSignOut } from '@/features/auth';

export function DeleteAccountPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { signOut } = useSignOut();

  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 削除リクエストを作成
  const handleConfirmDeletion = async () => {
    setIsDialogOpen(false);
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
  };

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('settings.deleteAccountPage.title')} />
      <ScrollView className="flex-1 px-4">
        {/* 警告アイコン */}
        <View className="items-center py-8">
          <View className="w-20 h-20 rounded-full bg-error-container justify-center items-center">
            <Ionicons name="warning" size={48} color="#EF4444" />
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
              <Ionicons name="ellipse" size={6} color="#9CA3AF" style={{ marginRight: 8 }} />
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
            placeholderTextColor="#9CA3AF"
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Button onPress={() => setIsDialogOpen(true)} disabled={isSubmitting} variant="destructive">
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <ButtonText className={buttonTextVariants({ variant: 'destructive' })}>
              {t('settings.deleteAccountPage.confirm')}
            </ButtonText>
          )}
        </Button>

        <View className="h-8" />
      </ScrollView>

      {/* 確認ダイアログ */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('settings.deleteAccountPage.confirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.deleteAccountPage.confirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text className="text-base font-medium text-on-surface text-center">
                {t('common.cancel')}
              </Text>
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onPress={handleConfirmDeletion}>
              <Text className="text-base font-medium text-white text-center">
                {t('settings.deleteAccountPage.confirm')}
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
