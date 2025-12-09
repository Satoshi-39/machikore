/**
 * プロフィール編集ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { PageHeader, StyledTextInput } from '@/shared/ui';
import { colors, INPUT_LIMITS } from '@/shared/config';
import { useCurrentUserId } from '@/entities/user';
import { useUser, useUpdateProfileWithAvatar } from '@/entities/user/api';

interface EditProfilePageProps {
  onSaveSuccess?: () => void;
}

export function EditProfilePage({ onSaveSuccess }: EditProfilePageProps) {
  const currentUserId = useCurrentUserId();
  const { data: user, isLoading: isLoadingUser } = useUser(currentUserId);
  const { updateProfile, isLoading: isSaving } = useUpdateProfileWithAvatar();

  // フォーム状態
  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期値を保持（変更検出用）
  const [initialDisplayName, setInitialDisplayName] = useState<string>('');
  const [initialBio, setInitialBio] = useState<string>('');

  // ユーザーデータが取得できたら初期値を設定
  React.useEffect(() => {
    if (user && !isInitialized) {
      const name = user.display_name || '';
      const userBio = user.bio || '';

      setDisplayName(name);
      setBio(userBio);
      setAvatarUri(user.avatar_url);

      // 初期値を保存
      setInitialDisplayName(name);
      setInitialBio(userBio);

      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // 変更があるかどうかを判定
  const hasChanges =
    displayName !== initialDisplayName ||
    bio !== initialBio ||
    newAvatarFile !== null;

  // 画像選択
  const handlePickImage = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('権限が必要です', '画像を選択するには写真ライブラリへのアクセスを許可してください。');
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
      setAvatarUri(asset.uri);
      setNewAvatarFile({
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || `avatar_${Date.now()}.jpg`,
      });
    }
  }, []);

  // 保存処理
  const handleSave = useCallback(async () => {
    if (!currentUserId) return;

    try {
      await updateProfile(
        currentUserId,
        {
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
        },
        newAvatarFile || undefined
      );

      Alert.alert('保存完了', 'プロフィールを更新しました。', [
        {
          text: 'OK',
          onPress: () => onSaveSuccess?.(),
        },
      ]);
    } catch (error) {
      console.error('[EditProfilePage] Save error:', error);
      Alert.alert('エラー', 'プロフィールの保存に失敗しました。');
    }
  }, [currentUserId, displayName, bio, newAvatarFile, updateProfile, onSaveSuccess]);

  if (isLoadingUser || !isInitialized) {
    return (
      <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
        <PageHeader title="プロフィール編集" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader
        title="プロフィール編集"
        rightComponent={
          <Pressable
            onPress={handleSave}
            disabled={isSaving || !hasChanges}
            className="px-4 py-2"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            ) : (
              <Text
                className={`text-base font-semibold ${
                  hasChanges
                    ? 'text-foreground dark:text-dark-foreground'
                    : 'text-foreground-muted dark:text-dark-foreground-muted'
                }`}
              >
                保存
              </Text>
            )}
          </Pressable>
        }
      />

      <KeyboardAwareScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
      >
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
              タップして写真を変更
            </Text>
          </View>

          {/* フォーム */}
          <View className="bg-surface dark:bg-dark-surface mt-4 px-4 py-4">
            {/* 表示名 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground dark:text-dark-foreground mb-1">
                表示名
              </Text>
              <StyledTextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="表示名を入力"
                className="border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
                maxLength={INPUT_LIMITS.USER_DISPLAY_NAME}
              />
              <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1 text-right">
                {displayName.length}/{INPUT_LIMITS.USER_DISPLAY_NAME}
              </Text>
            </View>

            {/* ユーザー名（変更不可） */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground dark:text-dark-foreground mb-1">
                ユーザー名
              </Text>
              <View className="border border-border dark:border-dark-border rounded-lg px-4 py-3 bg-background-secondary dark:bg-dark-background-secondary">
                <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary">@{user?.username}</Text>
              </View>
              <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1">
                ユーザー名は変更できません
              </Text>
            </View>

            {/* 自己紹介 */}
            <View>
              <Text className="text-sm font-medium text-foreground dark:text-dark-foreground mb-1">
                自己紹介
              </Text>
              <StyledTextInput
                value={bio}
                onChangeText={setBio}
                placeholder="自己紹介を入力"
                className="border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
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
        {/* 下部余白 */}
        <View className="h-16" />
      </KeyboardAwareScrollView>
    </View>
  );
}
