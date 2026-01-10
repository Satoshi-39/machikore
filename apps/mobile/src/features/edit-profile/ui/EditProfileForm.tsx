/**
 * プロフィール編集フォーム
 *
 * 基本情報の編集UI（アバター、表示名、ユーザー名、自己紹介）
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Input } from '@/shared/ui';
import { colors, INPUT_LIMITS } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

export interface AvatarFile {
  uri: string;
  type: string;
  name: string;
}

interface EditProfileFormProps {
  /** 編集モード（fullモードでユーザー名表示） */
  isFullMode: boolean;
  /** アバターURL */
  avatarUri: string | null;
  /** アバター変更時のコールバック */
  onAvatarChange: (uri: string, file: AvatarFile) => void;
  /** 表示名 */
  displayName: string;
  /** 表示名変更時のコールバック */
  onDisplayNameChange: (value: string) => void;
  /** ユーザー名 */
  username: string;
  /** ユーザー名変更時のコールバック */
  onUsernameChange: (value: string) => void;
  /** ユーザー名エラー */
  usernameError: string | null;
  /** 自己紹介 */
  bio: string;
  /** 自己紹介変更時のコールバック */
  onBioChange: (value: string) => void;
}

export function EditProfileForm({
  isFullMode,
  avatarUri,
  onAvatarChange,
  displayName,
  onDisplayNameChange,
  username,
  onUsernameChange,
  usernameError,
  bio,
  onBioChange,
}: EditProfileFormProps) {
  const { t } = useI18n();

  // 画像選択
  const handlePickImage = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(t('profile.photoPermissionRequired'), t('profile.photoPermissionMessage'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onAvatarChange(asset.uri, {
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || `avatar_${Date.now()}.jpg`,
      });
    }
  }, [onAvatarChange, t]);

  // ユーザー名入力ハンドラー
  const handleUsernameChange = useCallback((text: string) => {
    // 小文字に変換して親コンポーネントに渡す（バリデーションは親で行う）
    onUsernameChange(text.toLowerCase());
  }, [onUsernameChange]);

  return (
    <>
      {/* アバター画像 */}
      <View className="items-center py-6 bg-surface dark:bg-dark-surface">
        <Pressable onPress={handlePickImage} className="relative">
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
              <Ionicons name="person" size={40} color={colors.text.secondary} />
            </View>
          )}
          <View
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary.DEFAULT }}
          >
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </Pressable>
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
          {t('profile.tapToChangePhoto')}
        </Text>
      </View>

      {/* フォーム */}
      <View className="bg-surface dark:bg-dark-surface mt-2 px-4 py-4 border-t border-border-light dark:border-dark-border">
        {/* セクションタイトル（fullモードのみ） */}
        {isFullMode && (
          <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-4">
            {t('profile.basicInfo')}
          </Text>
        )}

        {/* 表示名 */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-foreground dark:text-dark-foreground mb-1">
            {t('profile.displayName')}
          </Text>
          <Input
            value={displayName}
            onChangeText={onDisplayNameChange}
            placeholder={t('profile.displayNamePlaceholder')}
            maxLength={INPUT_LIMITS.USER_DISPLAY_NAME}
          />
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1 text-right">
            {displayName.length}/{INPUT_LIMITS.USER_DISPLAY_NAME}
          </Text>
        </View>

        {/* ユーザー名（fullモードのみ） */}
        {isFullMode && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground dark:text-dark-foreground mb-1">
              {t('profile.username')}
            </Text>
            <View className="flex-row items-center border border-border dark:border-dark-border rounded-lg px-4 py-3">
              <Text className="text-base text-foreground-muted dark:text-dark-foreground-muted">@</Text>
              <Input
                value={username}
                onChangeText={handleUsernameChange}
                placeholder={t('profile.usernamePlaceholder')}
                className="flex-1 text-base ml-1 border-0 p-0"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
            </View>
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1">
              {t('profile.usernameHint')}
            </Text>
            <Text className="text-xs text-red-500 dark:text-red-400 mt-1">
              {t('profile.usernameChangeWarning')}
            </Text>
            {usernameError && (
              <Text className="text-xs text-red-500 mt-1">{usernameError}</Text>
            )}
          </View>
        )}

        {/* 自己紹介 */}
        <View>
          <Text className="text-sm font-medium text-foreground dark:text-dark-foreground mb-1">
            {t('profile.bio')}
          </Text>
          <Input
            value={bio}
            onChangeText={onBioChange}
            placeholder={t('profile.bioPlaceholder')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
            maxLength={INPUT_LIMITS.USER_BIO}
          />
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1 text-right">
            {bio.length}/{INPUT_LIMITS.USER_BIO}
          </Text>
        </View>
      </View>
    </>
  );
}
