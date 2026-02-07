/**
 * ユーザー名編集ページ
 *
 * アカウント設定から遷移する専用編集画面
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PageHeader, Input } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useCurrentUserId, validateUsername } from '@/entities/user';
import { useUser } from '@/entities/user/api';
import { isReservedUsername } from '@machikore/database';
import { checkUsernameAvailability, updateUserProfile } from '@/shared/api/supabase/users';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';

export function EditUsernamePage() {
  const router = useRouter();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const { data: user } = useUser(currentUserId);

  const [username, setUsername] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
      setInitialUsername(user.username);
    }
  }, [user?.username]);

  const handleUsernameChange = useCallback((text: string) => {
    const lowered = text.toLowerCase();
    setUsername(lowered);
    const validationError = validateUsername(lowered);
    if (validationError === 'usernameInvalid') {
      setUsernameError(t('profile.usernameInvalid'));
    } else {
      setUsernameError(null);
    }
  }, [t]);

  const hasChanged = username !== initialUsername;
  const canSave = hasChanged && username.trim().length > 0 && !usernameError;

  const handleSave = useCallback(async () => {
    if (!currentUserId || !canSave) return;

    const validationError = validateUsername(username);
    if (validationError) {
      setUsernameError(t(`profile.${validationError}`));
      return;
    }

    if (isReservedUsername(username)) {
      setUsernameError(t('profile.usernameReserved'));
      return;
    }

    setIsSaving(true);
    try {
      const isAvailable = await checkUsernameAvailability(username, currentUserId);
      if (!isAvailable) {
        setUsernameError(t('profile.usernameTaken'));
        return;
      }

      await updateUserProfile(currentUserId, { username: username.toLowerCase() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersDetail(currentUserId) });

      Alert.alert(t('settings.usernameSaved'), '', [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    } catch (error) {
      log.error('[EditUsernamePage] Save error:', error);
      Alert.alert(t('common.error'), t('errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  }, [currentUserId, username, canSave, t, queryClient, router]);

  return (
    <View className="flex-1 bg-surface">
      <PageHeader
        title={t('settings.username')}
        rightComponent={
          <View className="px-4 py-2">
            {isSaving ? (
              <ActivityIndicator size="small" className="text-primary" />
            ) : (
              <Text
                onPress={canSave ? handleSave : undefined}
                className={`text-base font-semibold ${canSave ? 'text-on-surface' : 'text-on-surface-variant'}`}
              >
                {t('common.save')}
              </Text>
            )}
          </View>
        }
      />
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24 }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        <Text className="text-sm font-medium text-on-surface mb-1">
          {t('settings.username')}
        </Text>
        <View className="flex-row items-center border-thin border-outline rounded-lg px-4 py-3">
          <Text className="text-base text-on-surface-variant">@</Text>
          <Input
            value={username}
            onChangeText={handleUsernameChange}
            placeholder={t('profile.usernamePlaceholder')}
            className="flex-1 text-base ml-1 p-0"
            style={{ borderWidth: 0 }}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            maxLength={20}
          />
        </View>
        <Text className="text-xs text-on-surface-variant mt-1">
          {t('profile.usernameHint')}
        </Text>
        <Text className="text-xs text-error mt-1">
          {t('profile.usernameChangeWarning')}
        </Text>
        {usernameError && (
          <Text className="text-xs text-red-500 mt-1">{usernameError}</Text>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}
