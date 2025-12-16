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

