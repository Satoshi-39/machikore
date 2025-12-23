/**
 * カテゴリAPI（Supabase）
 */

import { supabase, handleSupabaseError } from './client';
import type { Database } from '@/shared/types/database.types';

// ===============================
// 型定義
// ===============================

// MergeDeepで拡張されたDatabase型から取得
export type Category = Database['public']['Tables']['categories']['Row'];

// ===============================
// API関数
// ===============================

/**
 * 全てのアクティブなカテゴリを取得
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    handleSupabaseError('getCategories', error);
  }

  return data || [];
}

/**
 * IDでカテゴリを取得
 * 注意: idはURL用のslugとしても使用可能（例: "food", "travel"）
 */
export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getCategoryById', error);
  }

  return data;
}

// ===============================
// ヘルパー関数
// ===============================

/**
 * カテゴリ名を現在の言語で取得
 */
export function getCategoryName(category: Category, locale: string = 'ja'): string {
  // デフォルト言語（日本語）の場合はそのまま返す
  if (locale === 'ja') {
    return category.name;
  }

  // 他言語の翻訳があれば返す
  if (category.name_translations && category.name_translations[locale]) {
    return category.name_translations[locale];
  }

  // 翻訳がなければデフォルト名を返す
  return category.name;
}
