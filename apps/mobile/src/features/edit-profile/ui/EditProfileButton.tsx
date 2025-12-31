/**
 * プロフィール編集ボタン
 *
 * 自分のプロフィール編集画面へ遷移するボタン
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '@/shared/lib/i18n';

export function EditProfileButton() {
  const { t } = useI18n();
  const router = useRouter();

  const handlePress = () => {
    router.push('/edit-profile');
  };

  return (
    <Pressable
      onPress={handlePress}
      className="px-4 py-2 rounded-full border border-border dark:border-dark-border active:bg-background-secondary dark:active:bg-dark-background-secondary"
    >
      <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
        {t('profile.editProfile')}
      </Text>
    </Pressable>
  );
}
