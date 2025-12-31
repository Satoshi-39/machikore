/**
 * ユーザー設定API
 *
 * テーマ、言語などのユーザー設定を取得・更新
 */

import { supabase } from './client';
import { log } from '@/shared/config/logger';
import { type SupportedLocale } from '@/shared/lib/i18n';
import { type ContentLanguageCode } from '@/shared/config/constants';

// テーマ設定の選択肢
export const SUPPORTED_THEMES = ['light', 'dark', 'system'] as const;
export type ThemePreference = (typeof SUPPORTED_THEMES)[number];

// 言語設定の選択肢（SUPPORTED_LOCALES + 'system'）
export type LocalePreference = SupportedLocale | 'system';

// コンテンツ言語フィルターの型（constants.tsで定義）
export type ContentLanguage = ContentLanguageCode;

export interface UserPreferences {
  user_id: string;
  theme: ThemePreference;
  locale: LocalePreference;
  content_languages: ContentLanguage[];
  preferred_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface UpdateUserPreferencesParams {
  theme?: ThemePreference;
  locale?: LocalePreference;
  content_languages?: ContentLanguage[];
  preferred_categories?: string[];
}

/**
 * ユーザー設定を取得
 * 設定がない場合はnullを返す（未作成状態）
 */
export async function getUserPreferences(): Promise<UserPreferences | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    log.warn('[UserPreferences] No authenticated user');
    return null;
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // レコードが存在しない場合はnullを返す
    if (error.code === 'PGRST116') {
      return null;
    }
    log.error('[UserPreferences] Error fetching:', error);
    throw error;
  }

  return data as UserPreferences;
}

/**
 * ユーザー設定を作成または更新（upsert）
 */
export async function upsertUserPreferences(
  settings: UpdateUserPreferencesParams
): Promise<UserPreferences> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(
      {
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    log.error('[UserPreferences] Error upserting:', error);
    throw error;
  }

  return data as UserPreferences;
}

/**
 * テーマ設定のみ更新
 */
export async function updateThemePreference(theme: ThemePreference): Promise<UserPreferences> {
  return upsertUserPreferences({ theme });
}

/**
 * 言語設定のみ更新
 */
export async function updateLocalePreference(locale: LocalePreference): Promise<UserPreferences> {
  return upsertUserPreferences({ locale });
}

/**
 * コンテンツ言語設定のみ更新
 */
export async function updateContentLanguages(content_languages: ContentLanguage[]): Promise<UserPreferences> {
  return upsertUserPreferences({ content_languages });
}

/**
 * 好みのカテゴリ設定のみ更新
 */
export async function updatePreferredCategories(preferred_categories: string[]): Promise<UserPreferences> {
  return upsertUserPreferences({ preferred_categories });
}
