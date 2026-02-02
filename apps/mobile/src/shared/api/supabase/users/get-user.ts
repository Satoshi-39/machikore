/**
 * ユーザー取得API
 */

import { supabase, handleSupabaseError } from '../client';
import type { UserRow } from '@/shared/types';

type User = UserRow;

/** UUID v4 形式かどうかを判定 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * ユーザー情報をIDで取得
 */
export async function getUserById(userId: string): Promise<User | null> {
  if (!isUUID(userId)) {
    return null;
  }

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
 * ユーザー情報をusernameで取得
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    handleSupabaseError('getUserByUsername', error);
  }

  return data;
}

/**
 * ユーザー情報をIDまたはusernameで取得
 * UUIDならIDで、それ以外はusernameで検索
 */
export async function getUserByIdentifier(identifier: string): Promise<User | null> {
  if (isUUID(identifier)) {
    return getUserById(identifier);
  }
  return getUserByUsername(identifier);
}

/**
 * メールアドレスが既に登録されているかチェック
 * @param email - チェックするメールアドレス
 * @returns true: 既に登録されている, false: 未登録
 */
export async function checkEmailExists(email: string): Promise<boolean | null> {
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

  // ネットワークエラー等の場合はnullを返す（判定不能）
  // 呼び出し側でnullの場合の処理を決定する
  if (error) {
    return null;
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
