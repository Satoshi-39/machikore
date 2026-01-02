/**
 * ユーザーエンティティ型定義
 */

import type { UserRow, UserInsert as UserInsertType, UserUpdate as UserUpdateType } from '@/shared/types';

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
