/**
 * ユーザーエンティティ型定義
 */

import type { UserRow, UserInsert as UserInsertType, UserUpdate as UserUpdateType } from '@/shared/types';
import type { ThemePreference, LocalePreference } from '@/shared/api/supabase/user-preferences';

// ===============================
// Supabase型からUser型を抽出
// ===============================

export type User = UserRow;
export type UserInsert = UserInsertType;
export type UserUpdate = UserUpdateType;

// ===============================
// 認証ユーザー型
// ===============================

export interface AuthUser {
  id: string;
  email?: string;
  isAnonymous: boolean;
}

// ===============================
// 認証状態型
// ===============================

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

// ===============================
// ユーザー設定型
// ===============================

/** ローカル用の設定型（user_idなし） */
export interface LocalPreferences {
  theme: ThemePreference;
  locale: LocalePreference;
}
