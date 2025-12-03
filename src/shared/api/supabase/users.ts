/**
 * Supabase Users API
 * ユーザー関連の操作
 */

import { supabase } from './client';
import type { Database } from '@/shared/types/supabase.generated';

type User = Database['public']['Tables']['users']['Row'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

/** プロフィール更新用の型 */
export interface ProfileUpdateData {
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
}

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
    console.error('[updateUserProfile] Error:', error);
    throw error;
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
    console.error('[getUserById] Error:', error);
    throw error;
  }

  return data;
}

/**
 * アバター画像をアップロード
 */
export async function uploadAvatar(
  userId: string,
  file: { uri: string; type: string; name: string }
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // ファイルをBlobとして取得
  const response = await fetch(file.uri);
  const blob = await response.blob();

  // Supabase Storageにアップロード
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, blob, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error('[uploadAvatar] Upload error:', uploadError);
    throw uploadError;
  }

  // 公開URLを取得
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * プッシュトークンを保存
 */
export async function updatePushToken(token: string): Promise<void> {
  const { error } = await supabase.rpc('update_push_token', { token });
  if (error) {
    console.error('[updatePushToken] Error:', error);
    throw error;
  }
}

/**
 * プッシュトークンをクリア
 */
export async function clearPushToken(): Promise<void> {
  const { error } = await supabase.rpc('clear_push_token');
  if (error) {
    console.error('[clearPushToken] Error:', error);
    throw error;
  }
}
