/**
 * Supabase Users API
 * ユーザー関連の操作
 */

import { supabase, handleSupabaseError } from './client';
import type { Database } from '@/shared/types/supabase.generated';

type User = Database['public']['Tables']['users']['Row'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

/** プロフィール更新用の型 */
export interface ProfileUpdateData {
  display_name?: string;
  bio?: string | null;
  avatar_url?: string | null;
}

// デモグラフィック型はconfigから再エクスポート
export type { Gender, AgeGroup, DemographicsData } from '@/shared/config/demographics';

/**
 * ユーザープロフィールを更新
 */
export async function updateUserProfile(
  userId: string,
  data: ProfileUpdateData
): Promise<User> {
  const updateData: UserUpdate = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  const { data: user, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    handleSupabaseError('updateUserProfile', error);
  }

  return user;
}

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
 * ユーザーのデモグラフィック情報を更新
 */
export async function updateUserDemographics(
  userId: string,
  data: {
    gender?: string | null;
    age_group?: string | null;
    country?: string | null;
    prefecture?: string | null;
  }
): Promise<User> {
  // supabase gen types で型を再生成するまで型アサーションを使用
  const updateData = {
    gender: data.gender,
    age_group: data.age_group,
    country: data.country,
    prefecture: data.prefecture,
    updated_at: new Date().toISOString(),
  } as UserUpdate;

  const { data: user, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    handleSupabaseError('updateUserDemographics', error);
  }

  return user;
}

/**
 * アバター画像をアップロード
 * Edge Function経由でアップロード（スポット画像と同じ方式）
 */
export async function uploadAvatar(
  userId: string,
  file: { uri: string; type: string; name: string }
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  // 共通のuploadImage関数を使用
  const { uploadImage, STORAGE_BUCKETS } = await import('./storage');

  const result = await uploadImage({
    uri: file.uri,
    bucket: STORAGE_BUCKETS.AVATARS,
    path: filePath,
    contentType: file.type,
  });

  if (!result.success) {
    throw result.error || new Error('アバターのアップロードに失敗しました');
  }

  return result.data.url;
}

/**
 * プッシュトークンを保存
 */
export async function updatePushToken(token: string): Promise<void> {
  const { error } = await supabase.rpc('update_push_token', { token });
  if (error) {
    handleSupabaseError('updatePushToken', error);
  }
}

/**
 * プッシュトークンをクリア
 */
export async function clearPushToken(): Promise<void> {
  const { error } = await supabase.rpc('clear_push_token');
  if (error) {
    handleSupabaseError('clearPushToken', error);
  }
}

// ===============================
// メールアドレス関連
// ===============================

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

// ===============================
// ユーザー名関連
// ===============================

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

/**
 * ユーザー名とプロフィールを更新
 */
export async function updateUserProfileWithUsername(
  userId: string,
  data: {
    username: string;
    display_name: string;
  }
): Promise<User> {
  const updateData: UserUpdate = {
    username: data.username.toLowerCase(),
    display_name: data.display_name.trim(),
    updated_at: new Date().toISOString(),
  };

  const { data: user, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    handleSupabaseError('updateUserProfileWithUsername', error);
  }

  return user;
}

// ===============================
// ユーザー検索（発見タブ用）
// ===============================

/**
 * ユーザー検索結果の型
 */
export interface UserSearchResult {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

/**
 * ユーザーをキーワードで検索（Supabase版）
 * 発見タブの検索で使用
 */
export async function searchUsers(
  query: string,
  limit: number = 30
): Promise<UserSearchResult[]> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      username,
      display_name,
      bio,
      avatar_url,
      created_at
    `)
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return (data || []).map((user) => ({
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    bio: user.bio,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  }));
}

