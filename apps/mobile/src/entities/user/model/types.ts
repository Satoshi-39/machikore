/**
 * ユーザーエンティティ型定義
 */

import type { Database } from '@/shared/types/supabase.generated';

// ===============================
// Supabase型からUser型を抽出
// ===============================

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

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
