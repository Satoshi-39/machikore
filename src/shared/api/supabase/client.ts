/**
 * Supabase クライアント
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '@/shared/config';

// ===============================
// Supabase クライアント作成
// ===============================

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ===============================
// 型エクスポート
// ===============================

// Supabase自動生成型は後で追加
// export type Database = {} from './database.types';
