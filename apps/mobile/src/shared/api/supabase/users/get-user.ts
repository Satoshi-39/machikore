/**
 * ユーザー取得API
 */

import { supabase, handleSupabaseError } from '../client';
import type { UserRow } from '@/shared/types';

type User = UserRow;

/**
 * ユーザー情報を取得
 */
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    handleSupabaseError('getUserById', error);
  }

  return data;
}

/**
 * メールアドレスが既に登録されているかチェック
 * @param email - チェックするメールアドレス
 * @returns true: 既に登録されている, false: 未登録
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  if (!email) return false;

  const normalizedEmail = email.toLowerCase().trim();

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .single();

  if (error && error.code === 'PGRST116') {
    // Not found = not registered
    return false;
  }

  // その他のエラーの場合もfalseを返す（安全側に倒す）
  if (error) {
    return false;
  }

  return !!data;
}

/**
 * ユーザー名の利用可否をチェック
 * @param username - チェックするユーザー名
 * @param excludeUserId - 除外するユーザーID（自分自身を除外する場合）
 * @returns true: 利用可能, false: 既に使用されている
 */
export async function checkUsernameAvailability(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  if (!username) return true;

  let query = supabase
    .from('users')
    .select('id')
    .eq('username', username.toLowerCase());

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data, error } = await query.single();

  if (error && error.code === 'PGRST116') {
    // Not found = available
    return true;
  }

  if (data) {
    // Username taken
    return false;
  }

  return true;
}
