/**
 * プロフィール編集ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui';
import { type Gender, type AgeGroup } from '@/shared/config';
import { useCurrentUserId, validateUsername } from '@/entities/user';
import { useUser, useUpdateProfileWithAvatar, useServerPreferences } from '@/entities/user/api';
import { checkUsernameAvailability, updateUserDemographics } from '@/shared/api/supabase/users';
import { updatePreferredCategories } from '@/shared/api/supabase/user-preferences';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getCategories, type Category } from '@/shared/api/supabase/categories';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import {
  EditProfileForm,
  DemographicsSection,
  InterestsSection,
  type AvatarFile,
} from '@/features/edit-profile';

type EditMode = 'simple' | 'full';

interface EditProfilePageProps {
  /**
   * 編集モード
   * - simple: アイコン、表示名、自己紹介のみ（マイページから）
   * - full: 全項目（設定から）
   */
  mode?: EditMode;
  onSaveSuccess?: () => void;
}

export function EditProfilePage({ mode = 'simple', onSaveSuccess }: EditProfilePageProps) {
  const isFullMode = mode === 'full';
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const { data: user, isLoading: isLoadingUser } = useUser(currentUserId);
  const { data: userPreferences } = useServerPreferences();
  const { updateProfile, isLoading: isSaving } = useUpdateProfileWithAvatar();

  // フォーム状態
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<AvatarFile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // デモグラフィック状態
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);

  // カテゴリ状態
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // 初期値を保持（変更検出用）
  const [initialUsername, setInitialUsername] = useState<string>('');
  const [initialDisplayName, setInitialDisplayName] = useState<string>('');
  const [initialBio, setInitialBio] = useState<string>('');
  const [initialGender, setInitialGender] = useState<Gender | null>(null);
  const [initialAgeGroup, setInitialAgeGroup] = useState<AgeGroup | null>(null);
  const [initialCountry, setInitialCountry] = useState<string | null>(null);
  const [initialPrefecture, setInitialPrefecture] = useState<string | null>(null);
  const [initialCategories, setInitialCategories] = useState<string[]>([]);

  // カテゴリを取得
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        log.error('[EditProfilePage] カテゴリ取得エラー:', err);
      } finally {
        setIsCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // ユーザーデータが取得できたら初期値を設定
  useEffect(() => {
    if (user && !isInitialized) {
      const userUsername = user.username || '';
      const name = user.display_name || '';
      const userBio = user.bio || '';

      setUsername(userUsername);
      setDisplayName(name);
      setBio(userBio);
      setAvatarUri(user.avatar_url);

      // デモグラフィック情報
      const gender = (user.gender as Gender) || null;
      const ageGroup = (user.age_group as AgeGroup) || null;
      const country = user.country || null;
      const prefecture = user.prefecture || null;

      setSelectedGender(gender);
      setSelectedAgeGroup(ageGroup);
      setSelectedCountry(country);
      setSelectedPrefecture(prefecture);

      // 初期値を保存
      setInitialUsername(userUsername);
      setInitialDisplayName(name);
      setInitialBio(userBio);
      setInitialGender(gender);
      setInitialAgeGroup(ageGroup);
      setInitialCountry(country);
      setInitialPrefecture(prefecture);

      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // user_preferencesからpreferred_categoriesを取得
  useEffect(() => {
    if (userPreferences?.preferred_categories && isInitialized) {
      const cats = userPreferences.preferred_categories;
      setSelectedCategories(cats);
      setInitialCategories(cats);
    }
  }, [userPreferences, isInitialized]);

  // 国が変更されたら都道府県をリセット（初期化時は除く）
  useEffect(() => {
    if (isInitialized && selectedCountry !== initialCountry) {
      setSelectedPrefecture(null);
    }
  }, [selectedCountry, isInitialized, initialCountry]);

  // ユーザー名変更ハンドラー
  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    // リアルタイムバリデーション（文字種のみチェック）
    const validationError = validateUsername(value);
    if (validationError === 'usernameInvalid') {
      setUsernameError(t('profile.usernameInvalid'));
    } else {
      setUsernameError(null);
    }
  }, [t]);

  // アバター変更ハンドラー
  const handleAvatarChange = useCallback((uri: string, file: AvatarFile) => {
    setAvatarUri(uri);
    setNewAvatarFile(file);
  }, []);

  // カテゴリ選択/解除
  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else if (prev.length < 5) {
        return [...prev, categoryId];
      }
      return prev;
    });
  }, []);

  // 変更があるかどうかを判定
  const hasChanges =
    username !== initialUsername ||
    displayName !== initialDisplayName ||
    bio !== initialBio ||
    newAvatarFile !== null ||
    selectedGender !== initialGender ||
    selectedAgeGroup !== initialAgeGroup ||
    selectedCountry !== initialCountry ||
    selectedPrefecture !== initialPrefecture ||
    JSON.stringify(selectedCategories.sort()) !== JSON.stringify(initialCategories.sort());

  // 保存可能かどうかを判定
  const canSave = isFullMode
    ? hasChanges && username.trim().length > 0 && displayName.trim().length > 0 && !usernameError
    : hasChanges && displayName.trim().length > 0;

  // 保存処理
  const handleSave = useCallback(async () => {
    if (!currentUserId) return;

    try {
      // fullモードの場合のみユーザー名のバリデーション
      if (isFullMode) {
        const usernameValidationError = validateUsername(username);
        if (usernameValidationError) {
          setUsernameError(t(`profile.${usernameValidationError}`));
          return;
        }

        // ユーザー名が変更された場合は重複チェック
        if (username !== initialUsername) {
          const isAvailable = await checkUsernameAvailability(username, currentUserId);
          if (!isAvailable) {
            setUsernameError(t('profile.usernameTaken'));
            return;
          }
        }
      }

      // プロフィール基本情報を保存
      await updateProfile(
        currentUserId,
        {
          username: isFullMode && username !== initialUsername ? username : undefined,
          display_name: displayName.trim() || undefined,
          bio: bio.trim() || null,
        },
        newAvatarFile || undefined
      );

      // デモグラフィック情報を保存（fullモードのみ）
      if (isFullMode) {
        const demographicsChanged =
          selectedGender !== initialGender ||
          selectedAgeGroup !== initialAgeGroup ||
          selectedCountry !== initialCountry ||
          selectedPrefecture !== initialPrefecture;

        if (demographicsChanged) {
          await updateUserDemographics(currentUserId, {
            gender: selectedGender,
            age_group: selectedAgeGroup,
            country: selectedCountry,
            prefecture: selectedPrefecture,
          });
          // デモグラフィック更新後にユーザーキャッシュを無効化
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersDetail(currentUserId) });
        }

        // カテゴリを保存
        const categoriesChanged =
          JSON.stringify(selectedCategories.sort()) !== JSON.stringify(initialCategories.sort());

        if (categoriesChanged && selectedCategories.length > 0) {
          await updatePreferredCategories(selectedCategories);
          // カテゴリ更新後にプリファレンスキャッシュを無効化
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userPreferences });
        }
      }

      Alert.alert(t('profile.profileSaved'), t('profile.profileSavedMessage'), [
        {
          text: t('common.ok'),
          onPress: () => onSaveSuccess?.(),
        },
      ]);
    } catch (error) {
      log.error('[EditProfilePage] Save error:', error);
      Alert.alert(t('common.error'), t('profile.profileSaveError'));
    }
  }, [
    currentUserId,
    isFullMode,
    username,
    initialUsername,
    displayName,
    bio,
    newAvatarFile,
    updateProfile,
    onSaveSuccess,
    t,
    selectedGender,
    selectedAgeGroup,
    selectedCountry,
    selectedPrefecture,
    selectedCategories,
    initialGender,
    initialAgeGroup,
    initialCountry,
    initialPrefecture,
    initialCategories,
    queryClient,
  ]);

  if (isLoadingUser || !isInitialized) {
    return (
      <View className="flex-1 bg-surface-variant">
        <PageHeader title={t('profile.editProfile')} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-variant">
      <PageHeader
        title={t('profile.editProfile')}
        rightComponent={
          <Pressable
            onPress={handleSave}
            disabled={isSaving || !canSave}
            className="px-4 py-2"
          >
            {isSaving ? (
              <ActivityIndicator size="small" className="text-primary" />
            ) : (
              <Text
                className={`text-base font-semibold ${
                  canSave
                    ? 'text-on-surface'
                    : 'text-on-surface-variant'
                }`}
              >
                {t('common.save')}
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
        {/* 基本情報フォーム */}
        <EditProfileForm
          isFullMode={isFullMode}
          avatarUri={avatarUri}
          onAvatarChange={handleAvatarChange}
          displayName={displayName}
          onDisplayNameChange={setDisplayName}
          username={username}
          onUsernameChange={handleUsernameChange}
          usernameError={usernameError}
          bio={bio}
          onBioChange={setBio}
        />

        {/* デモグラフィック情報（fullモードのみ） */}
        {isFullMode && (
          <DemographicsSection
            selectedGender={selectedGender}
            onGenderChange={setSelectedGender}
            selectedAgeGroup={selectedAgeGroup}
            onAgeGroupChange={setSelectedAgeGroup}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            selectedPrefecture={selectedPrefecture}
            onPrefectureChange={setSelectedPrefecture}
          />
        )}

        {/* 興味・関心（fullモードのみ） */}
        {isFullMode && (
          <InterestsSection
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            isLoading={isCategoriesLoading}
          />
        )}

        {/* 下部余白 */}
        <View className="h-16" />
      </KeyboardAwareScrollView>
    </View>
  );
}
