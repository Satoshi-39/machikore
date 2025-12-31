/**
 * ユーザー設定を取得・更新するhooks
 *
 * ログイン時: サーバー（user_preferences）から取得・更新
 * 未ログイン時: AsyncStorageから取得・更新（フォールバック）
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUserPreferences,
  upsertUserPreferences,
  type UserPreferences,
  type UpdateUserPreferencesParams,
  type ThemePreference,
  type LocalePreference,
  type ContentLanguage,
} from '@/shared/api/supabase/user-preferences';
import { useUserStore } from '@/entities/user/model';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { i18n, useI18n, type SupportedLocale } from '@/shared/lib/i18n';

// デフォルト設定
const DEFAULT_PREFERENCES: LocalPreferences = {
  theme: 'system',
  locale: 'system',
};

// ===============================
// Types
// ===============================

/** ローカル用の設定型（user_idなし） */
export interface LocalPreferences {
  theme: ThemePreference;
  locale: LocalePreference;
}

// ===============================
// Local Storage Helpers
// ===============================

async function getLocalPreferences(): Promise<LocalPreferences> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to get local preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

async function setLocalPreferences(prefs: Partial<LocalPreferences>): Promise<LocalPreferences> {
  try {
    const current = await getLocalPreferences();
    const updated = { ...current, ...prefs };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('Failed to set local preferences:', error);
    throw error;
  }
}

// ===============================
// Server Hooks (Logged in users)
// ===============================

/**
 * サーバーからユーザー設定を取得（ログインユーザー用）
 */
export function useServerPreferences() {
  const user = useUserStore((state) => state.user);

  return useQuery<UserPreferences | null, Error>({
    queryKey: QUERY_KEYS.userPreferences,
    queryFn: getUserPreferences,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });
}

/**
 * サーバーのユーザー設定を更新（ログインユーザー用）
 */
export function useUpdateServerPreferences() {
  const queryClient = useQueryClient();

  return useMutation<UserPreferences, Error, UpdateUserPreferencesParams>({
    mutationFn: upsertUserPreferences,
    onMutate: async (newSettings) => {
      // 楽観的更新
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.userPreferences });

      const previousSettings = queryClient.getQueryData<UserPreferences | null>(QUERY_KEYS.userPreferences);

      if (previousSettings) {
        queryClient.setQueryData<UserPreferences>(QUERY_KEYS.userPreferences, {
          ...previousSettings,
          ...newSettings,
        });
      }

      return { previousSettings };
    },
    onError: (_err, _newSettings, context) => {
      // エラー時はロールバック
      const ctx = context as { previousSettings?: UserPreferences | null } | undefined;
      if (ctx?.previousSettings !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.userPreferences, ctx.previousSettings);
      }
    },
    onSuccess: (data) => {
      // 成功時はサーバーから返ってきたデータでキャッシュを更新
      queryClient.setQueryData(QUERY_KEYS.userPreferences, data);
    },
  });
}

// ===============================
// Unified Hooks (Auto-detect login state)
// ===============================

/**
 * ユーザー設定を取得（ログイン状態に応じて自動切り替え）
 *
 * - ログイン時: サーバーから取得
 * - 未ログイン時: AsyncStorageから取得
 */
export function useUserPreferences() {
  const user = useUserStore((state) => state.user);
  const serverQuery = useServerPreferences();
  const [localPrefs, setLocalPrefs] = useState<LocalPreferences>(DEFAULT_PREFERENCES);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  // 未ログイン時はローカルから取得
  useEffect(() => {
    if (!user) {
      setIsLocalLoading(true);
      getLocalPreferences()
        .then(setLocalPrefs)
        .finally(() => setIsLocalLoading(false));
    }
  }, [user]);

  // ログイン時はサーバーの値を返す
  if (user) {
    const prefs: LocalPreferences | null = serverQuery.data
      ? { theme: serverQuery.data.theme, locale: serverQuery.data.locale }
      : null;

    return {
      data: prefs,
      isLoading: serverQuery.isLoading,
      error: serverQuery.error,
      isAuthenticated: true,
    };
  }

  // 未ログイン時はローカルの値を返す
  return {
    data: localPrefs,
    isLoading: isLocalLoading,
    error: null,
    isAuthenticated: false,
  };
}

/**
 * ユーザー設定を更新（ログイン状態に応じて自動切り替え）
 */
export function useUpdateUserPreferences() {
  const user = useUserStore((state) => state.user);
  const serverMutation = useUpdateServerPreferences();
  const [isLocalUpdating, setIsLocalUpdating] = useState(false);
  const [localError, setLocalError] = useState<Error | null>(null);

  const updatePreferences = useCallback(
    async (params: UpdateUserPreferencesParams) => {
      if (user) {
        // ログイン時はサーバーに保存
        serverMutation.mutate(params);
      } else {
        // 未ログイン時はローカルに保存
        setIsLocalUpdating(true);
        setLocalError(null);
        try {
          await setLocalPreferences(params);
        } catch (error) {
          setLocalError(error as Error);
        } finally {
          setIsLocalUpdating(false);
        }
      }

      // 言語設定の場合はi18nにも反映
      if (params.locale && params.locale !== 'system') {
        i18n.locale = params.locale;
      }
    },
    [user, serverMutation]
  );

  if (user) {
    return {
      mutate: updatePreferences,
      isPending: serverMutation.isPending,
      error: serverMutation.error,
      isAuthenticated: true,
    };
  }

  return {
    mutate: updatePreferences,
    isPending: isLocalUpdating,
    error: localError,
    isAuthenticated: false,
  };
}

/**
 * テーマ設定を取得・更新する便利フック
 */
export function useThemePreference() {
  const { data, isLoading } = useUserPreferences();
  const { mutate, isPending } = useUpdateUserPreferences();

  const theme = data?.theme ?? 'system';

  const setTheme = useCallback(
    (newTheme: ThemePreference) => {
      mutate({ theme: newTheme });
    },
    [mutate]
  );

  return {
    theme,
    setTheme,
    isLoading,
    isPending,
  };
}

/**
 * 言語設定を取得・更新する便利フック
 */
export function useLocalePreference() {
  const { data, isLoading } = useUserPreferences();
  const { mutate, isPending } = useUpdateUserPreferences();

  const locale = data?.locale ?? 'system';

  // 実際に適用されている言語（systemの場合はi18nの現在値）
  const effectiveLocale: SupportedLocale =
    locale === 'system' ? (i18n.locale as SupportedLocale) : locale;

  const setLocale = useCallback(
    (newLocale: LocalePreference) => {
      mutate({ locale: newLocale });
      // 表示言語はOS設定で管理されるため、ここでは保存のみ行う
    },
    [mutate]
  );

  return {
    locale,
    effectiveLocale,
    setLocale,
    isLoading,
    isPending,
  };
}

/**
 * locale から ContentLanguage へのマッピング
 * cn, tw は zh にマッピング
 */
function localeToContentLanguage(locale: SupportedLocale): ContentLanguage {
  if (locale === 'cn' || locale === 'tw') {
    return 'zh';
  }
  return locale as ContentLanguage;
}

/**
 * コンテンツ言語設定を取得・更新する便利フック
 */
export function useContentLanguagesPreference() {
  const user = useUserStore((state) => state.user);
  const serverQuery = useServerPreferences();
  const { mutate, isPending } = useUpdateUserPreferences();
  const { locale } = useI18n();

  // サーバーから取得した生の値（空配列 = 未設定）
  const contentLanguages: ContentLanguage[] = serverQuery.data?.content_languages ?? [];

  // 実際に適用される言語（空配列の場合はlocale言語をデフォルトとして使用）
  const effectiveContentLanguages: ContentLanguage[] = useMemo(() => {
    if (contentLanguages.length === 0) {
      return [localeToContentLanguage(locale)];
    }
    return contentLanguages;
  }, [contentLanguages, locale]);

  const setContentLanguages = useCallback(
    (languages: ContentLanguage[]) => {
      mutate({ content_languages: languages });
    },
    [mutate]
  );

  const toggleLanguage = useCallback(
    (language: ContentLanguage) => {
      const newLanguages = contentLanguages.includes(language)
        ? contentLanguages.filter((l) => l !== language)
        : [...contentLanguages, language];
      setContentLanguages(newLanguages);
    },
    [contentLanguages, setContentLanguages]
  );

  return {
    /** 生のcontent_languages（空配列 = 未設定） */
    contentLanguages,
    /** 実際に適用される言語（未設定の場合はlocale言語） */
    effectiveContentLanguages,
    setContentLanguages,
    toggleLanguage,
    isLoading: serverQuery.isLoading,
    isPending,
    isAuthenticated: !!user,
  };
}

// ===============================
// Migration Helper
// ===============================

/**
 * ログイン時にローカル設定をサーバーに同期
 * AuthProviderから呼び出す
 *
 * @param currentLocale - 現在のUI言語（OSから取得した言語）
 */
export async function syncLocalPreferencesToServer(currentLocale?: SupportedLocale): Promise<void> {
  try {
    const localPrefs = await getLocalPreferences();

    // サーバーの現在の設定を取得
    const serverPrefs = await getUserPreferences();

    // サーバーに設定がない場合、ローカル設定をアップロード
    if (!serverPrefs) {
      await upsertUserPreferences({
        theme: localPrefs.theme,
        locale: currentLocale ?? localPrefs.locale,
      });
      return;
    }

    // サーバーに設定がある場合、localeのみ更新（通知用言語として最新のOS言語を反映）
    if (currentLocale && serverPrefs.locale !== currentLocale) {
      await upsertUserPreferences({
        locale: currentLocale,
      });
    }
  } catch (error) {
    console.warn('Failed to sync local preferences to server:', error);
    // 失敗しても続行
  }
}

// 型のre-export
export type { UserPreferences, UpdateUserPreferencesParams, ThemePreference, LocalePreference, ContentLanguage };
