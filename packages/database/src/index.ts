/**
 * @machikore/database
 *
 * Supabase型定義とデータベース関連のユーティリティを提供
 */

export * from './types';

// 共通の型エイリアス
export type { Database, Json } from './types';

// テーブルの行型を簡単にアクセスするためのヘルパー型
import type { Database } from './types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
