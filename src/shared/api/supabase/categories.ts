/**
 * カテゴリAPI（Supabase）
 */

import { supabase, handleSupabaseError } from './client';

// ===============================
// 型定義
// ===============================

export interface Category {
  id: string;
  slug: string;
  name: string;
  name_translations: { [key: string]: string } | null;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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

/**
 * slugでカテゴリを取得
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getCategoryBySlug', error);
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
