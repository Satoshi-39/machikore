/**
 * プロフィール更新API
 */

import { supabase, handleSupabaseError } from '../client';
import type { UserRow, UserUpdate } from '@/shared/types';
import type { ProfileUpdateData } from './types';

type User = UserRow;

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

/**
 * オンボーディング完了をDBに記録
 */
export async function completeOnboarding(userId: string): Promise<User> {
  const { data: user, error } = await supabase
    .from('users')
    .update({
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    handleSupabaseError('completeOnboarding', error);
  }

  return user;
}
